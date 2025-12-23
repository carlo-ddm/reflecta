import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PageService } from '../../services/page.service';
import { EntryPreview } from '../../models/models';
import { Snackbar } from '../../../ui/ui-components/snackbar/snackbar.ui';
import { SnackbarData } from '../../../ui/models/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-write',
  imports: [ReactiveFormsModule, Snackbar],
  templateUrl: './write.page.html',
  styleUrl: './write.page.scss',
})
export class WritePage {
  private router = inject(Router);
  private pageService = inject(PageService);
  form = new FormGroup({
    ['entry-text']: new FormControl(''),
  });
  isAnalysisDialogOpen = signal<boolean>(false);
  snackbar = signal<SnackbarData | null>(null);
  private pending?: Promise<boolean>;
  private resolve?: (value: boolean | PromiseLike<boolean>) => void;
  private timeoutId: any;

  onAnalysisButtonClick(isOpen: boolean) {
    this.setAnalysisDialogOpen(isOpen);
  }

  onSubmit() {
    // guard
    if (this.pending) {
      if (this.resolve) this.resolve(false);
      this.closeSnackbar();
    }

    const entryPreview: EntryPreview = {
      id: null,
      createdAt: '2025-02-03T21:18:00Z',
      snippet: this.form.get('entry-text')?.value ?? '', // to patch
      hasAnalysis: true,
      analysis: {
        energy: 44,
        valence: 52,
        clarity: 86,
        tension: 67,
        timeOrientation: 41,
        createdAt: '2025-02-03T21:25:00Z',
      },
    };

    this.pageService.insertEntry(entryPreview);
    this.form.reset();

    this.setAnalysisDialogOpen(false);
    this.snackbar.set({
      snackbarIsOpen: true,
      snackbarTitle: 'Salvato',
      snackbarMessage: 'Entry salvata in memoria.',
      snackbarAction: 'Vai a Entries',
      snackbarDismiss: 'Chiudi',
    });
    this.snackbarAction();
  }

  onSubmitAnalysis() {
    // TODO: recupero dell'analisi (analisi non presente)
    this.onSubmit();
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
