export interface EntryListItem {
  id: string;
  authorId: string;
  createdAt: string;
  date: string;
  title: string;
  snippet: string;
}

export interface EntryDetail extends EntryListItem {
  content: string;
}

export interface EntryFilters {
  q: string;
  from: string;
  to: string;
}

export const EMPTY_FILTERS: EntryFilters = { q: '', from: '', to: '' };

export const hasActiveFilters = (filters: EntryFilters): boolean =>
  Boolean(filters.q.trim() || filters.from || filters.to);
