import type { AnalysisMetric } from '../../generated/prisma/enums.js';

export interface MetricScoreDto {
  key: AnalysisMetric;
  score: number;
}

export interface AnalysisDto {
  id: string;
  entryId: string;
  createdAt: Date;
  metrics: MetricScoreDto[];
}

export const toAnalysisDto = (analysis: {
  id: string;
  entryId: string;
  createdAt: Date;
  metrics: Array<{ key: AnalysisMetric; score: number }>;
}): AnalysisDto => ({
  id: analysis.id,
  entryId: analysis.entryId,
  createdAt: analysis.createdAt,
  metrics: analysis.metrics.map((metric) => ({
    key: metric.key,
    score: metric.score,
  })),
});
