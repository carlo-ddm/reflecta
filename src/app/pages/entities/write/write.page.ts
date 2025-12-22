import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PageService } from '../../services/page.service';
import { EntryPreview } from '../../models/models';

@Component({
  selector: 'app-write',
  imports: [ReactiveFormsModule],
  templateUrl: './write.page.html',
  styleUrl: './write.page.scss',
})
export class WritePage {
  private pageService = inject(PageService);
  form = new FormGroup({
    ['entry-text']: new FormControl(''),
  });
  isAnalysisDialogOpen = signal<boolean>(false);

  onAnalysisButtonClick(isOpen: boolean) {
    this.setAnalysisDialogOpen(isOpen);
  }

  onSubmit() {
    const entryPreview: EntryPreview = {
      id: 'entry-2025-02-03',
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

    this.pageService.savaEntry(entryPreview);
  }

  onSubmitAnalysis() {
    // TODO: recupero dell'analisi (analisi non presente)
    this.onSubmit();
  }

  private setAnalysisDialogOpen(isOpen: boolean) {
    this.isAnalysisDialogOpen.set(isOpen);
  }
}
