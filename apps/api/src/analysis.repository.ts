import { prisma } from './prisma.js';
import type { AnalysisMetric } from '../generated/prisma/enums.js';

export interface CreateMetricScoreInput {
  key: AnalysisMetric;
  score: number;
}

export interface CreateAnalysisInput {
  entryId: string;
  metrics: CreateMetricScoreInput[];
}

export async function createAnalysis(input: CreateAnalysisInput) {
  return prisma.analysis.create({
    data: {
      entryId: input.entryId,
      metrics: {
        create: input.metrics.map((metric) => ({
          key: metric.key,
          score: metric.score,
        })),
      },
    },
    include: { metrics: true },
  });
}
