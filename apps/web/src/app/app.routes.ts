import { Routes } from '@angular/router';
import { WritePage } from './pages/page-components/write/write.page';
import { EntriesPage } from './pages/page-components/entries/entries.page';
import { EntryDetailPage } from './pages/page-components/entry-detail/entry-detail.page';
import { SettingsPage } from './pages/page-components/settings/settings.page';

export const routes: Routes = [
  { path: '', component: WritePage },
  {
    path: 'entries',
    component: EntriesPage,
  },
  { path: 'entries/:id', component: EntryDetailPage },
  { path: 'settings', component: SettingsPage },
];
