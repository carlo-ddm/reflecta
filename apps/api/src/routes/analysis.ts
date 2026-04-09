import express, { Router } from 'express';
import { createAnalysis } from '../analysis.repository.js';
import { toAnalysisDto } from '../dtos/analysis.dto.js';
import { getEntryById } from '../entry.repository.js';
import { HttpError } from '../middlewares/error-handler.js';
import { computeMetrics } from '../analysis.utils.js';

const analysisRouter: Router = express.Router();

const isNonEmptyString = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;
const isValidUlid = (value: string) => /^[0-9A-HJKMNP-TV-Z]{26}$/i.test(value);

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
