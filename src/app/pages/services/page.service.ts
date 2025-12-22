import { Injectable, signal } from '@angular/core';
import { EntryPreview } from '../models/models';
import { ENTRY_PREVIEW_MOCK } from '../mock/page';
import { ulid } from 'ulid';

@Injectable({
  providedIn: 'root',
})
export class PageService {
  private entry_preview_mock = signal<EntryPreview[]>(ENTRY_PREVIEW_MOCK);

  getEntryList() {
    return this.entry_preview_mock.asReadonly();
  }

  insertEntry(ep: EntryPreview) {
    const ulidId = ulid();
    const entryPreview = { ...ep, id: ulidId };
    this.entry_preview_mock.update((eps: EntryPreview[]) => [...eps, entryPreview]);
  }
}
