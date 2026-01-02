import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PageService } from '../../services/page.service';
import { Snackbar } from '../../../ui/ui-components/snackbar/snackbar.ui';
import { SnackbarData } from '../../../ui/models/models';
import { Router } from '@angular/router';
import { ButtonUi } from '../../../ui/ui-components/button/button.ui';
import { getAuthorId, setAuthorId } from '../../../config/api.config';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-write',
  imports: [ReactiveFormsModule, Snackbar, ButtonUi],
  templateUrl: './write.page.html',
  styleUrl: './write.page.scss',
})
export class WritePage {
  private router = inject(Router);
  private pageService = inject(PageService);
  form = new FormGroup({
    ['entry-text']: new FormControl(''),
  });
  authorIdControl = new FormControl(getAuthorId());
  authorId = signal<string>(getAuthorId());
  isAnalysisDialogOpen = signal<boolean>(false);
  snackbar = signal<SnackbarData | null>(null);
  private pending?: Promise<boolean>;
  private resolve?: (value: boolean | PromiseLike<boolean>) => void;
  private timeoutId: any;

  get hasContent(): boolean {
    const value = this.form.get('entry-text')?.value ?? '';
    return String(value).trim().length > 0;
  }

  get hasAuthorId(): boolean {
    return Boolean(this.authorId().trim());
  }

  saveAuthorId() {
    const value = String(this.authorIdControl.value ?? '').trim();
    setAuthorId(value);
    this.authorId.set(value);
  }

  onAnalysisButtonClick(isOpen: boolean) {
    this.setAnalysisDialogOpen(isOpen);
  }

  onSubmit() {
    // guard
    if (this.pending) {
      if (this.resolve) this.resolve(false);
      this.closeSnackbar();
    }

    const rawContent = this.form.get('entry-text')?.value ?? '';
    const content = String(rawContent).trim();

    if (!content) {
      this.snackbar.set({
        snackbarIsOpen: true,
        snackbarTitle: 'Testo vuoto',
        snackbarMessage: 'Scrivi qualcosa prima di salvare.',
        snackbarAction: '',
        snackbarDismiss: 'Chiudi',
      });
      return;
    }

    const authorId = this.authorId().trim();

    if (!authorId) {
      this.snackbar.set({
        snackbarIsOpen: true,
        snackbarTitle: 'Configurazione mancante',
        snackbarMessage: 'Imposta l\'Author ID nella configurazione locale.',
        snackbarAction: '',
        snackbarDismiss: 'Chiudi',
      });
      return;
    }

    firstValueFrom(
      this.pageService.createEntry({
        authorId,
        content,
      }),
    )
      .then(() => {
        this.form.reset();
        this.setAnalysisDialogOpen(false);
        this.snackbar.set({
          snackbarIsOpen: true,
          snackbarTitle: 'Salvato',
          snackbarMessage: 'Entry salvata con successo.',
          snackbarAction: 'Vai a Entries',
          snackbarDismiss: 'Chiudi',
        });
        this.snackbarAction();
      })
      .catch(() => {
        this.snackbar.set({
          snackbarIsOpen: true,
          snackbarTitle: 'Errore',
          snackbarMessage: 'Impossibile salvare l\'entry.',
          snackbarAction: '',
          snackbarDismiss: 'Chiudi',
        });
      });
  }

  onSubmitAnalysis() {
    const rawContent = this.form.get('entry-text')?.value ?? '';
    const content = String(rawContent).trim();

    if (!content) {
      this.snackbar.set({
        snackbarIsOpen: true,
        snackbarTitle: 'Testo vuoto',
        snackbarMessage: 'Scrivi qualcosa prima di analizzare.',
        snackbarAction: '',
        snackbarDismiss: 'Chiudi',
      });
      return;
    }

    const authorId = this.authorId().trim();

    if (!authorId) {
      this.snackbar.set({
        snackbarIsOpen: true,
        snackbarTitle: 'Configurazione mancante',
        snackbarMessage: 'Imposta l\'Author ID nella configurazione locale.',
        snackbarAction: '',
        snackbarDismiss: 'Chiudi',
      });
      return;
    }

    firstValueFrom(
      this.pageService.createEntry({
        authorId,
        content,
      }),
    )
      .then((entry) => firstValueFrom(this.pageService.requestAnalysis(entry.id)))
      .then(() => {
        this.form.reset();
        this.setAnalysisDialogOpen(false);
        this.snackbar.set({
          snackbarIsOpen: true,
          snackbarTitle: 'Analisi salvata',
          snackbarMessage: 'Entry salvata con analisi.',
          snackbarAction: 'Vai a Entries',
          snackbarDismiss: 'Chiudi',
        });
        this.snackbarAction();
      })
      .catch(() => {
        this.snackbar.set({
          snackbarIsOpen: true,
          snackbarTitle: 'Errore',
          snackbarMessage: 'Impossibile completare l\'analisi.',
          snackbarAction: '',
          snackbarDismiss: 'Chiudi',
        });
      });
  }

  onCloseSnackbar(result: boolean) {
    const resolve = this.resolve;
    this.closeSnackbar();
    resolve?.(result);
  }

  private closeSnackbar() {
    this.resolve = undefined;
    this.pending = undefined;
    clearTimeout(this.timeoutId);
    this.timeoutId = undefined;
    this.snackbar.set({
      snackbarIsOpen: false,
      snackbarTitle: '',
      snackbarMessage: '',
      snackbarAction: '',
      snackbarDismiss: '',
    } as SnackbarData);
  }

  private snackbarAction() {
    this.snackbarWait().then((res) => {
      if (res) this.router.navigate(['/entries']);
    });
  }

  private snackbarWait(): Promise<boolean> {
    if (this.pending) {
      return this.pending;
    }
    this.pending = new Promise((resolve) => {
      this.resolve = resolve;
      this.timeoutId = setTimeout(() => {
        resolve(false);
        this.closeSnackbar();
      }, 5000);
    });
    return this.pending;
  }

  private setAnalysisDialogOpen(isOpen: boolean) {
    this.isAnalysisDialogOpen.set(isOpen);
  }
}
