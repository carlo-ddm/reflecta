import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-analysis-dialog',
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Analisi (checkpoint)</h2>
    <mat-dialog-content>
      <p class="analysis-dialog__lead">
        L'analisi verra calcolata e salvata alla conferma.
      </p>
      <div class="analysis-dialog__grid" role="list">
        <div class="analysis-dialog__item" role="listitem">
          <div class="analysis-dialog__label">Energy</div>
          <div class="analysis-dialog__value">--</div>
        </div>
        <div class="analysis-dialog__item" role="listitem">
          <div class="analysis-dialog__label">Mood</div>
          <div class="analysis-dialog__value">--</div>
        </div>
        <div class="analysis-dialog__item" role="listitem">
          <div class="analysis-dialog__label">Clarity</div>
          <div class="analysis-dialog__value">--</div>
        </div>
        <div class="analysis-dialog__item" role="listitem">
          <div class="analysis-dialog__label">Stress</div>
          <div class="analysis-dialog__value">--</div>
        </div>
        <div class="analysis-dialog__item" role="listitem">
          <div class="analysis-dialog__label">Focus</div>
          <div class="analysis-dialog__value">--</div>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Annulla</button>
      <button mat-flat-button color="primary" [mat-dialog-close]="true">Salva</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .analysis-dialog__lead {
        margin: 0 0 var(--s-4);
        color: var(--muted);
      }

      .analysis-dialog__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: var(--s-3);
      }

      .analysis-dialog__item {
        border-radius: var(--r-2);
        border: 1px solid var(--border);
        padding: var(--s-3);
        background: var(--surface-2);
        display: grid;
        gap: 6px;
      }

      .analysis-dialog__label {
        font-size: var(--fs-2);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--muted);
      }

      .analysis-dialog__value {
        font-size: var(--fs-4);
        font-weight: var(--fw-semibold);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalysisDialog {}
