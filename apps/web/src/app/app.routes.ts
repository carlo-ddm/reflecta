import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/page-components/write/write.page').then((m) => m.WritePage),
  },
  {
    path: 'entries',
    loadComponent: () =>
      import('./pages/page-components/entries/entries.page').then((m) => m.EntriesPage),
  },
  {
    path: 'entries/:id',
    loadComponent: () =>
      import('./pages/page-components/entry-detail/entry-detail.page').then(
        (m) => m.EntryDetailPage,
      ),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./pages/page-components/settings/settings.page').then((m) => m.SettingsPage),
  },
];
