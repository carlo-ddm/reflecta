import { Routes } from '@angular/router';
import { WritePage } from './pages/entities/write/write.page';
import { EntriesPage } from './pages/entities/entries/entries.page';
import { EntryDetailPage } from './pages/entities/entry-detail/entry-detail.page';

export const routes: Routes = [
  { path: 'write', component: WritePage },
  {
    path: 'entries',
    component: EntriesPage,
    children: [{ path: ':id', component: EntryDetailPage }],
  },
];
