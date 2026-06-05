import express, { Router } from 'express';
import { toEntryDetailDto, toEntryListItemDto } from '../dtos/entry.dto.js';
import { createEntry, deleteEntryById, getEntries, getEntryById } from '../entry.repository.js';
import { HttpError } from '../middlewares/error-handler.js';

const entriesRouter: Router = express.Router();
const MAX_CONTENT_LENGTH = 5000;
const MAX_SNIPPET_LENGTH = 240;
const MAX_TITLE_LENGTH = 120;
const MAX_QUERY_LENGTH = 120;

const isNonEmptyString = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;
const isValidUlid = (value: string) => /^[0-9A-HJKMNP-TV-Z]{26}$/i.test(value);
const isDateOnly = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

// Parse a date query parameter. Date-only strings ("YYYY-MM-DD") are expanded to
// the start or end of that local day so range filters are inclusive.
// Returns: undefined when absent, null when present-but-invalid, otherwise a Date.
const parseDateParam = (value: unknown, endOfDay: boolean): Date | null | undefined => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return undefined;
  }

  const raw = value.trim();
  const normalized = isDateOnly(raw)
    ? `${raw}T${endOfDay ? '23:59:59.999' : '00:00:00.000'}`
    : raw;
  const parsed = new Date(normalized);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

entriesRouter.get('/entries', async (req, res, next) => {
  try {
    const authorId = typeof req.query.authorId === 'string' ? req.query.authorId.trim() : undefined;
    if (authorId && !isValidUlid(authorId)) {
      return next(new HttpError(400, 'authorId is invalid'));
    }

    const rawQuery = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const query = rawQuery ? rawQuery.slice(0, MAX_QUERY_LENGTH) : undefined;

    const dateFrom = parseDateParam(req.query.from, false);
    if (dateFrom === null) {
      return next(new HttpError(400, 'from is invalid'));
    }

    const dateTo = parseDateParam(req.query.to, true);
    if (dateTo === null) {
      return next(new HttpError(400, 'to is invalid'));
    }

    const rawPage = Number(req.query.page);
    const rawLimit = Number(req.query.limit);
    const page = Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1;
    const limit = Number.isFinite(rawLimit) && rawLimit >= 1 && rawLimit <= 100 ? Math.floor(rawLimit) : 20;

    const result = await getEntries({ authorId, query, dateFrom, dateTo, page, limit });

    res.status(200).json({
      data: result.data.map(toEntryListItemDto),
      meta: { page: result.page, limit: result.limit, total: result.total },
    });
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

  const { authorId, content, title, date, snippet } = body as Record<string, unknown>;

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

  if (title !== undefined && typeof title !== 'string') {
    return next(new HttpError(400, 'title must be a string'));
  }

  const normalizedTitle = isNonEmptyString(title) ? title.trim().slice(0, MAX_TITLE_LENGTH) : '';

  let normalizedDate = new Date();
  if (date !== undefined) {
    if (typeof date !== 'string') {
      return next(new HttpError(400, 'date must be an ISO date string'));
    }
    const parsed = parseDateParam(date, false);
    if (!parsed) {
      return next(new HttpError(400, 'date is invalid'));
    }
    normalizedDate = parsed;
  }

  if (snippet !== undefined && typeof snippet !== 'string') {
    return next(new HttpError(400, 'snippet must be a string'));
  }

  const normalizedSnippet = isNonEmptyString(snippet)
    ? snippet.trim().slice(0, MAX_SNIPPET_LENGTH)
    : normalizedContent.slice(0, MAX_SNIPPET_LENGTH);

  try {
    const entry = await createEntry({
      authorId: normalizedAuthorId,
      title: normalizedTitle,
      date: normalizedDate,
      content: normalizedContent,
      snippet: normalizedSnippet,
    });

    res.status(201).json(toEntryDetailDto(entry));
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
