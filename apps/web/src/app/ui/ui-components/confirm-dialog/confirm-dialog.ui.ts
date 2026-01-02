import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'primary' | 'warn';
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <p class="confirm-dialog__message">{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button class="rf-button rf-button--tonal" mat-dialog-close>
        {{ data.cancelLabel ?? 'Annulla' }}
      </button>
      <button
        mat-flat-button
        class="rf-button"
        [class.rf-button--primary]="(data.tone ?? 'primary') !== 'warn'"
        [class.rf-button--ghost]="(data.tone ?? 'primary') === 'warn'"
        [mat-dialog-close]="true"
      >
        {{ data.confirmLabel ?? 'Conferma' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .confirm-dialog__message {
        margin: 0;
        color: var(--muted);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialog {
  protected readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
}
