export interface EntryPreview {
  id: string;
  createdAt: string; // ISO
  snippet: string;
  hasAnalysis: boolean;
  analysis?: AnalysisPreview;
}

export interface AnalysisPreview {
  energy: number;
  valence: number;
  clarity: number;
  tension: number;
  timeOrientation: number;
  createdAt: string; // ISO
}
