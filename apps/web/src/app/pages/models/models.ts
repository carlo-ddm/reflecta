export type AnalysisMetricKey = 'MOOD' | 'ENERGY' | 'STRESS' | 'FOCUS' | 'CLARITY';

export interface MetricScore {
  key: AnalysisMetricKey;
  score: number;
}

export interface Analysis {
  id: string;
  entryId: string;
  createdAt: string;
  metrics: MetricScore[];
}

export interface EntryListItem {
  id: string;
  authorId: string;
  createdAt: string;
  snippet: string;
  hasAnalysis: boolean;
}

export interface EntryDetail extends EntryListItem {
  content: string;
  analysis: Analysis | null;
}

export const ANALYSIS_METRIC_LABELS: Record<AnalysisMetricKey, string> = {
  ENERGY: 'Energy',
  MOOD: 'Mood',
  CLARITY: 'Clarity',
  STRESS: 'Stress',
  FOCUS: 'Focus',
};

export const ANALYSIS_METRIC_ORDER: AnalysisMetricKey[] = [
  'ENERGY',
  'MOOD',
  'CLARITY',
  'STRESS',
  'FOCUS',
];
