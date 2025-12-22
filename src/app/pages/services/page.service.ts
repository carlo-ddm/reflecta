import { Injectable, signal } from '@angular/core';
import { EntryPreview } from '../models/models';
import { ENTRY_PREVIEW_MOCK } from '../mock/page';

@Injectable({
  providedIn: 'root',
})
export class PageService {
  private entry_preview_mock = signal<EntryPreview[]>(ENTRY_PREVIEW_MOCK);

  savaEntry(entry: EntryPreview) {
    console.log('entry', entry);
  }
}
