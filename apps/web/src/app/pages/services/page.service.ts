import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, firstValueFrom, of, tap } from 'rxjs';
import { API_BASE_URL, getAuthorId } from '../../config/api.config';
import type { Analysis, EntryDetail, EntryListItem } from '../models/models';

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
  private lastFetchTimestamp = 0;

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

  isLoadingMore = signal(false);

  async loadEntries(force = false) {
    const now = Date.now();
    if (!force && this.lastFetchTimestamp > 0 && now - this.lastFetchTimestamp < CACHE_TTL_MS) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.currentPage.set(1);

    const authorId = getAuthorId().trim();
    let params = new HttpParams().set('page', '1').set('limit', String(PAGE_LIMIT));
    if (authorId) {
      params = params.set('authorId', authorId);
    }

    try {
      const result = await firstValueFrom(
        this.http.get<PaginatedResponse<EntryListItem>>(`${API_BASE_URL}/entries`, { params }),
      );
      const normalized = result.data.map((entry) => ({
        ...entry,
        hasAnalysis: Boolean(entry.hasAnalysis),
      }));
      this.entryList.set(normalized);
      this.totalEntries.set(result.meta.total);
      this.hasMore.set(result.meta.page * result.meta.limit < result.meta.total);
      this.lastFetchTimestamp = Date.now();
    } catch {
      this.error.set('Impossibile caricare le entries.');
    } finally {
      this.loading.set(false);
    }
  }

  async loadMore() {
    if (!this.hasMore() || this.isLoadingMore()) return;

    this.isLoadingMore.set(true);
    const nextPage = this.currentPage() + 1;

    const authorId = getAuthorId().trim();
    let params = new HttpParams().set('page', String(nextPage)).set('limit', String(PAGE_LIMIT));
    if (authorId) {
      params = params.set('authorId', authorId);
    }

    try {
      const result = await firstValueFrom(
        this.http.get<PaginatedResponse<EntryListItem>>(`${API_BASE_URL}/entries`, { params }),
      );
      const normalized = result.data.map((entry) => ({
        ...entry,
        hasAnalysis: Boolean(entry.hasAnalysis),
      }));
      this.entryList.update((entries) => [...entries, ...normalized]);
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
      tap((entry) => {
        this.upsertEntry({
          ...entry,
          hasAnalysis: Boolean(entry.analysis ?? entry.hasAnalysis),
        });
      }),
    );
  }

  createEntry(payload: { authorId: string; content: string; snippet?: string; analyze?: boolean }) {
    return this.http.post<EntryDetail>(`${API_BASE_URL}/entries`, payload).pipe(
      tap((entry) => {
        this.upsertEntry({
          ...entry,
          hasAnalysis: Boolean(entry.analysis ?? entry.hasAnalysis),
        });
        this.invalidateCache();
      }),
    );
  }

  requestAnalysis(entryId: string) {
    return this.http.post<Analysis>(`${API_BASE_URL}/analysis`, { entryId }).pipe(
      tap(() => {
        this.entryList.update((entries) =>
          entries.map((entry) =>
            entry.id === entryId
              ? {
                  ...entry,
                  hasAnalysis: true,
                }
              : entry,
          ),
        );
      }),
    );
  }

  deleteEntry(entryId: string) {
    return this.http.delete(`${API_BASE_URL}/entries/${entryId}`).pipe(
      tap(() => {
        this.entryList.update((entries) => entries.filter((entry) => entry.id !== entryId));
        this.invalidateCache();
      }),
    );
  }

  private invalidateCache() {
    this.lastFetchTimestamp = 0;
  }

  private upsertEntry(entry: EntryDetail) {
    this.entryList.update((entries) => {
      const index = entries.findIndex((item) => item.id === entry.id);
      const next = {
        id: entry.id,
        authorId: entry.authorId,
        createdAt: entry.createdAt,
        snippet: entry.snippet,
        hasAnalysis: Boolean(entry.analysis ?? entry.hasAnalysis),
      };

      if (index === -1) {
        return [next, ...entries];
      }

      return entries.map((item, idx) => (idx === index ? next : item));
    });
  }
}
