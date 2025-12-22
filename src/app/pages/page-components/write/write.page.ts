import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PageService } from '../../services/page.service';
import { EntryPreview } from '../../models/models';
import { Snackbar } from '../../../UI/ui-components/snackbar/snackbar.ui';
import { SnackbarData } from '../../../UI/models/models';

@Component({
  selector: 'app-write',
  imports: [ReactiveFormsModule, Snackbar],
  templateUrl: './write.page.html',
  styleUrl: './write.page.scss',
})
export class WritePage {
  private pageService = inject(PageService);
  form = new FormGroup({
    ['entry-text']: new FormControl(''),
  });
  isAnalysisDialogOpen = signal<boolean>(false);
  snackbar = signal<SnackbarData | null>(null);

  onAnalysisButtonClick(isOpen: boolean) {
    this.setAnalysisDialogOpen(isOpen);
  }

  onSubmit() {
    const entryPreview: EntryPreview = {
      id: null,
      createdAt: '2025-02-03T21:18:00Z',
      snippet:
        'Serata di riflessione forzata: poche azioni, ma molta chiarezza su cosa evitare in futuro.',
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

    this.setAnalysisDialogOpen(false);
    this.pageService.insertEntry(entryPreview);
    this.snackbar.set({
      snackbarIsOpen: true,
      snackbarTitle: 'Salvato',
      snackbarMessage: 'Entry salvata in memoria.',
      snackbarAction: 'Vai a Entries',
      snackbarDismiss: 'Chiudi',
    });
  }

  onSubmitAnalysis() {
    // TODO: recupero dell'analisi (analisi non presente)
    this.onSubmit();
  }

  private setAnalysisDialogOpen(isOpen: boolean) {
    this.isAnalysisDialogOpen.set(isOpen);
  }
}
