import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import { API_BASE_URL } from '../../config/api.config';
import type { Analysis, EntryDetail, EntryListItem } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class PageService {
  private http = inject(HttpClient);
  private entryList = signal<EntryListItem[]>([]);
  private loading = signal<boolean>(false);
  private error = signal<string | null>(null);

  getEntryList() {
    return this.entryList.asReadonly();
  }

  isLoading() {
    return this.loading.asReadonly();
  }

  errorMessage() {
    return this.error.asReadonly();
  }

  loadEntries() {
    this.loading.set(true);
    this.error.set(null);

    this.http
      .get<EntryListItem[]>(`${API_BASE_URL}/entries`)
      .pipe(
        tap((entries) => {
          const normalized = entries.map((entry) => ({
            ...entry,
            hasAnalysis: Boolean(entry.hasAnalysis),
          }));
          this.entryList.set(normalized);
        }),
        catchError(() => {
          this.error.set('Impossibile caricare le entries.');
          return of([]);
        }),
      )
      .subscribe({
        complete: () => this.loading.set(false),
      });
  }

  getEntry(id: string) {
    return this.http.get<EntryDetail>(`${API_BASE_URL}/entries/${id}`).pipe(
      tap((entry) => {
        this.upsertEntry({
          ...entry,
          hasAnalysis: Boolean(entry.analysis),
        });
      }),
    );
  }

  createEntry(payload: { authorId: string; content: string; snippet?: string }) {
    return this.http.post<EntryDetail>(`${API_BASE_URL}/entries`, payload).pipe(
      tap((entry) => {
        this.upsertEntry({
          ...entry,
          hasAnalysis: Boolean(entry.analysis),
        });
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

  private upsertEntry(entry: EntryDetail) {
    this.entryList.update((entries) => {
      const index = entries.findIndex((item) => item.id === entry.id);
      const next = {
        id: entry.id,
        authorId: entry.authorId,
        createdAt: entry.createdAt,
        snippet: entry.snippet,
        hasAnalysis: Boolean(entry.analysis),
      };

      if (index === -1) {
        return [next, ...entries];
      }

      return entries.map((item, idx) => (idx === index ? next : item));
    });
  }
}
