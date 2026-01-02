import express, { Router } from 'express';
import { createAnalysis } from '../analysis.repository.js';
import { toAnalysisDto } from '../dtos/analysis.dto.js';
import { getEntryById } from '../entry.repository.js';
import { HttpError } from '../middlewares/error-handler.js';
import { AnalysisMetric } from '../../generated/prisma/enums.js';

const analysisRouter: Router = express.Router();

const isNonEmptyString = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;
const isValidUlid = (value: string) => /^[0-9A-HJKMNP-TV-Z]{26}$/i.test(value);
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const computeMetrics = (content: string) => {
  const text = content.trim();
  const wordCount = text ? text.split(/\s+/).length : 0;
  const charCount = text.length;
  const exclamations = (text.match(/!/g) ?? []).length;
  const questions = (text.match(/\?/g) ?? []).length;

  const energy = clamp01(wordCount / 80 + exclamations * 0.02);
  const stress = clamp01(questions * 0.05 + exclamations * 0.03);
  const mood = clamp01(0.5 + exclamations * 0.02 - questions * 0.02);
  const focus = clamp01(1 - Math.min(1, wordCount / 200));
  const clarity = clamp01(1 - Math.min(1, charCount / 2000));

  return [
    { key: AnalysisMetric.MOOD, score: mood },
    { key: AnalysisMetric.ENERGY, score: energy },
    { key: AnalysisMetric.STRESS, score: stress },
    { key: AnalysisMetric.FOCUS, score: focus },
    { key: AnalysisMetric.CLARITY, score: clarity },
  ];
};

analysisRouter.post('/analysis', async (req, res, next) => {
  const body = req.body;

  if (!body || typeof body !== 'object') {
    return next(new HttpError(400, 'Invalid JSON body'));
  }

  const { entryId } = body as Record<string, unknown>;

  if (!isNonEmptyString(entryId)) {
    return next(new HttpError(400, 'entryId is required'));
  }

  const normalizedEntryId = entryId.trim();

  if (!isValidUlid(normalizedEntryId)) {
    return next(new HttpError(400, 'entryId is invalid'));
  }

  try {
    const entry = await getEntryById(normalizedEntryId);

    if (!entry) {
      return next(new HttpError(404, 'Entry not found'));
    }

    if (entry.analysis) {
      return next(new HttpError(409, 'Analysis already exists for this entry'));
    }

    const metrics = computeMetrics(entry.content);
    const analysis = await createAnalysis({ entryId: entry.id, metrics });

    res.status(201).json(toAnalysisDto(analysis));
  } catch (error) {
    next(error);
  }
});

export default analysisRouter;
