import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { applyTheme, getThemePreference } from './app/config/api.config';

// Apply saved theme before Angular bootstraps to prevent flash
applyTheme(getThemePreference());

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
