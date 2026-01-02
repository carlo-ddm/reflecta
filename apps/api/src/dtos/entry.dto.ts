import type { AnalysisDto } from './analysis.dto.js';
import { toAnalysisDto } from './analysis.dto.js';
import type { AnalysisMetric } from '../../generated/prisma/enums.js';

export interface EntryListItemDto {
  id: string;
  authorId: string;
  createdAt: Date;
  snippet: string;
  hasAnalysis: boolean;
}

export interface EntryDetailDto extends EntryListItemDto {
  content: string;
  analysis: AnalysisDto | null;
}

export const toEntryListItemDto = (entry: {
  id: string;
  authorId: string;
  createdAt: Date;
  snippet: string;
  analysis?: { id: string } | null;
}): EntryListItemDto => ({
  id: entry.id,
  authorId: entry.authorId,
  createdAt: entry.createdAt,
  snippet: entry.snippet,
  hasAnalysis: Boolean(entry.analysis),
});

export const toEntryDetailDto = (entry: {
  id: string;
  authorId: string;
  createdAt: Date;
  snippet: string;
  content: string;
  analysis:
    | {
        id: string;
        entryId: string;
        createdAt: Date;
        metrics: Array<{ key: AnalysisMetric; score: number }>;
      }
    | null;
}): EntryDetailDto => ({
  id: entry.id,
  authorId: entry.authorId,
  createdAt: entry.createdAt,
  snippet: entry.snippet,
  hasAnalysis: Boolean(entry.analysis),
  content: entry.content,
  analysis: entry.analysis ? toAnalysisDto(entry.analysis) : null,
});
