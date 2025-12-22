import { Routes } from '@angular/router';
import { WritePage } from './pages/page-components/write/write.page';
import { EntriesPage } from './pages/page-components/entries/entries.page';
import { EntryDetailPage } from './pages/page-components/entry-detail/entry-detail.page';

export const routes: Routes = [
  { path: 'write', component: WritePage },
  {
    path: 'entries',
    component: EntriesPage,
    children: [{ path: ':id', component: EntryDetailPage }],
  },
];
