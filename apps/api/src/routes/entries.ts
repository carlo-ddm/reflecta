import express, { Router } from 'express';
import { createAnalysis } from '../analysis.repository.js';
import { toEntryDetailDto, toEntryListItemDto } from '../dtos/entry.dto.js';
import { createEntry, deleteEntryById, getEntries, getEntryById } from '../entry.repository.js';
import { HttpError } from '../middlewares/error-handler.js';
import { AnalysisMetric } from '../../generated/prisma/enums.js';

const entriesRouter: Router = express.Router();
const allowedMetricKeys = new Set(Object.values(AnalysisMetric));
const MAX_CONTENT_LENGTH = 5000;
const MAX_SNIPPET_LENGTH = 240;

const isNonEmptyString = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;
const isValidUlid = (value: string) => /^[0-9A-HJKMNP-TV-Z]{26}$/i.test(value);
const isValidScore = (value: number) => value >= 0 && value <= 1;

entriesRouter.get('/entries', async (_req, res, next) => {
  try {
    const entries = await getEntries();
    res.status(200).json(entries.map(toEntryListItemDto));
  } catch (error) {
    next(error);
  }
});

entriesRouter.get('/entries/:id', async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new HttpError(400, 'id is required'));
  }

  if (!isValidUlid(id)) {
    return next(new HttpError(400, 'id is invalid'));
  }

  try {
    const entry = await getEntryById(id);

    if (!entry) {
      return next(new HttpError(404, 'Entry not found'));
    }

    res.status(200).json(toEntryDetailDto(entry));
  } catch (error) {
    next(error);
  }
});

entriesRouter.post('/entries', async (req, res, next) => {
  const body = req.body;

  if (!body || typeof body !== 'object') {
    return next(new HttpError(400, 'Invalid JSON body'));
  }

  const { authorId, content, snippet, analysis } = body as Record<string, unknown>;

  if (!isNonEmptyString(authorId)) {
    return next(new HttpError(400, 'authorId is required'));
  }

  const normalizedAuthorId = authorId.trim();

  if (!isValidUlid(normalizedAuthorId)) {
    return next(new HttpError(400, 'authorId is invalid'));
  }

  if (!isNonEmptyString(content)) {
    return next(new HttpError(400, 'content is required'));
  }

  const normalizedContent = content.trim();

  if (normalizedContent.length > MAX_CONTENT_LENGTH) {
    return next(new HttpError(400, `content exceeds ${MAX_CONTENT_LENGTH} characters`));
  }

  const normalizedSnippet = isNonEmptyString(snippet)
    ? snippet.trim().slice(0, MAX_SNIPPET_LENGTH)
    : normalizedContent.slice(0, MAX_SNIPPET_LENGTH);

  let normalizedMetrics: Array<{ key: AnalysisMetric; score: number }> | null = null;

  if (analysis !== undefined) {
    if (!analysis || typeof analysis !== 'object') {
      return next(new HttpError(400, 'analysis must be an object'));
    }

    const { metrics } = analysis as Record<string, unknown>;

    if (!Array.isArray(metrics) || metrics.length === 0) {
      return next(new HttpError(400, 'analysis.metrics must be a non-empty array'));
    }

    const mappedMetrics = metrics.map((metric) => {
      if (!metric || typeof metric !== 'object') {
        return null;
      }

      const { key, score } = metric as Record<string, unknown>;

      if (typeof key !== 'string' || !allowedMetricKeys.has(key as AnalysisMetric)) {
        return null;
      }

      if (typeof score !== 'number' || Number.isNaN(score)) {
        return null;
      }

      if (!isValidScore(score)) {
        return null;
      }

      return { key: key as AnalysisMetric, score };
    });

    if (mappedMetrics.some((metric) => metric === null)) {
      return next(new HttpError(400, 'Invalid analysis.metrics item'));
    }

    normalizedMetrics = mappedMetrics as Array<{ key: AnalysisMetric; score: number }>;
  }

  try {
    const entry = await createEntry({
      authorId: normalizedAuthorId,
      content: normalizedContent,
      snippet: normalizedSnippet,
    });

    const createdAnalysis = normalizedMetrics
      ? await createAnalysis({
          entryId: entry.id,
          metrics: normalizedMetrics,
        })
      : null;

    res.status(201).json(
      toEntryDetailDto({
        ...entry,
        analysis: createdAnalysis,
      }),
    );
  } catch (error) {
    next(error);
  }
});

entriesRouter.delete('/entries/:id', async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new HttpError(400, 'id is required'));
  }

  if (!isValidUlid(id)) {
    return next(new HttpError(400, 'id is invalid'));
  }

  try {
    const entry = await deleteEntryById(id);

    if (!entry) {
      return next(new HttpError(404, 'Entry not found'));
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default entriesRouter;
