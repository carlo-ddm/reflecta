import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom, tap } from 'rxjs';
import { API_BASE_URL, getAuthorId } from '../../config/api.config';
import {
  EMPTY_FILTERS,
  hasActiveFilters,
  type EntryDetail,
  type EntryFilters,
  type EntryListItem,
} from '../models/models';

interface PaginatedResponse<T> {
  data: T[];
  meta: { page: number; limit: number; total: number };
}

const CACHE_TTL_MS = 30_000;
const PAGE_LIMIT = 20;

@Injectable({
  providedIn: 'root',
})
export class PageService {
  private http = inject(HttpClient);
  private entryList = signal<EntryListItem[]>([]);
  private loading = signal<boolean>(false);
  private error = signal<string | null>(null);
  private currentPage = signal<number>(1);
  private totalEntries = signal<number>(0);
  private hasMore = signal<boolean>(false);
  private filters = signal<EntryFilters>({ ...EMPTY_FILTERS });
  private lastFetchTimestamp = 0;

  isLoadingMore = signal(false);

  getEntryList() {
    return this.entryList.asReadonly();
  }

  isLoading() {
    return this.loading.asReadonly();
  }

  errorMessage() {
    return this.error.asReadonly();
  }

  getHasMore() {
    return this.hasMore.asReadonly();
  }

  getTotal() {
    return this.totalEntries.asReadonly();
  }

  getFilters() {
    return this.filters.asReadonly();
  }

  private buildParams(page: number): HttpParams {
    let params = new HttpParams().set('page', String(page)).set('limit', String(PAGE_LIMIT));

    const authorId = getAuthorId().trim();
    if (authorId) {
      params = params.set('authorId', authorId);
    }

    const { q, from, to } = this.filters();
    if (q.trim()) {
      params = params.set('q', q.trim());
    }
    if (from) {
      params = params.set('from', from);
    }
    if (to) {
      params = params.set('to', to);
    }

    return params;
  }

  private normalize = (entry: EntryListItem): EntryListItem => ({
    id: entry.id,
    authorId: entry.authorId,
    createdAt: entry.createdAt,
    date: entry.date,
    title: entry.title ?? '',
    snippet: entry.snippet,
  });

  async applyFilters(filters: EntryFilters) {
    this.filters.set({ ...filters });
    this.invalidateCache();
    await this.loadEntries(true);
  }

  async clearFilters() {
    if (!hasActiveFilters(this.filters())) return;
    await this.applyFilters({ ...EMPTY_FILTERS });
  }

  async loadEntries(force = false) {
    const now = Date.now();
    if (!force && this.lastFetchTimestamp > 0 && now - this.lastFetchTimestamp < CACHE_TTL_MS) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.currentPage.set(1);

    try {
      const result = await firstValueFrom(
        this.http.get<PaginatedResponse<EntryListItem>>(`${API_BASE_URL}/entries`, {
          params: this.buildParams(1),
        }),
      );
      this.entryList.set(result.data.map(this.normalize));
      this.totalEntries.set(result.meta.total);
      this.hasMore.set(result.meta.page * result.meta.limit < result.meta.total);
      this.lastFetchTimestamp = Date.now();
    } catch {
      this.error.set('Impossibile caricare le voci del diario.');
    } finally {
      this.loading.set(false);
    }
  }

  async loadMore() {
    if (!this.hasMore() || this.isLoadingMore()) return;

    this.isLoadingMore.set(true);
    const nextPage = this.currentPage() + 1;

    try {
      const result = await firstValueFrom(
        this.http.get<PaginatedResponse<EntryListItem>>(`${API_BASE_URL}/entries`, {
          params: this.buildParams(nextPage),
        }),
      );
      this.entryList.update((entries) => [...entries, ...result.data.map(this.normalize)]);
      this.currentPage.set(nextPage);
      this.totalEntries.set(result.meta.total);
      this.hasMore.set(result.meta.page * result.meta.limit < result.meta.total);
    } catch {
      // silently fail for load more
    } finally {
      this.isLoadingMore.set(false);
    }
  }

  getEntry(id: string) {
    return this.http.get<EntryDetail>(`${API_BASE_URL}/entries/${id}`).pipe(
      tap((entry) => this.upsertEntry(entry)),
    );
  }

  createEntry(payload: {
    authorId: string;
    content: string;
    title: string;
    date: string;
    snippet?: string;
  }) {
    return this.http.post<EntryDetail>(`${API_BASE_URL}/entries`, payload).pipe(
      tap((entry) => {
        this.upsertEntry(entry);
        this.invalidateCache();
      }),
    );
  }

  deleteEntry(entryId: string) {
    return this.http.delete(`${API_BASE_URL}/entries/${entryId}`).pipe(
      tap(() => {
        this.entryList.update((entries) => entries.filter((entry) => entry.id !== entryId));
        this.totalEntries.update((total) => Math.max(0, total - 1));
        this.invalidateCache();
      }),
    );
  }

  private invalidateCache() {
    this.lastFetchTimestamp = 0;
  }

  private upsertEntry(entry: EntryDetail) {
    const next = this.normalize(entry);
    this.entryList.update((entries) => {
      const index = entries.findIndex((item) => item.id === entry.id);
      if (index === -1) {
        return [next, ...entries];
      }
      return entries.map((item, idx) => (idx === index ? next : item));
    });
  }
}
