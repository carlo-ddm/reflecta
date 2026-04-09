import { AnalysisMetric } from '../generated/prisma/enums.js';

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export const computeMetrics = (content: string) => {
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
