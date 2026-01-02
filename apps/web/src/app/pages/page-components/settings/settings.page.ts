import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { getAuthorId, setAuthorId } from '../../../config/api.config';
import { ConfirmDialog } from '../../../ui/ui-components/confirm-dialog/confirm-dialog.ui';

@Component({
  selector: 'app-settings',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './settings.page.html',
  styleUrl: './settings.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPage {
  private dialog = inject(MatDialog);
  authorIdControl = new FormControl(getAuthorId());
  authorIdVisible = signal<boolean>(false);

  get authorIdInputType(): string {
    return this.authorIdVisible() ? 'text' : 'password';
  }

  get isAuthorIdEmpty(): boolean {
    return !String(this.authorIdControl.value ?? '').trim();
  }

  get isAuthorIdValid(): boolean {
    const value = String(this.authorIdControl.value ?? '').trim();
    return /^[0-9A-HJKMNP-TV-Z]{26}$/i.test(value);
  }

  get canSaveAuthorId(): boolean {
    return !this.isAuthorIdEmpty && this.isAuthorIdValid;
  }

  get canRemoveAuthorId(): boolean {
    return Boolean(getAuthorId().trim());
  }

  saveAuthorId() {
    const value = String(this.authorIdControl.value ?? '').trim();
    if (!value || !this.isAuthorIdValid) {
      return;
    }
    setAuthorId(value);
    this.authorIdControl.setValue(value);
  }

  toggleAuthorIdVisibility() {
    this.authorIdVisible.set(!this.authorIdVisible());
  }

  openRemoveConfirm() {
    if (!this.canRemoveAuthorId) return;

    const dialogRef = this.dialog.open(ConfirmDialog, {
      panelClass: 'rf-dialog',
      autoFocus: false,
      data: {
        title: 'Rimuovere l\'Author ID?',
        message: 'Non potrai creare nuove entries finche non lo reimposti.',
        confirmLabel: 'Rimuovi',
        cancelLabel: 'Annulla',
        tone: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.confirmRemoveAuthorId();
      }
    });
  }

  private confirmRemoveAuthorId() {
    setAuthorId('');
    this.authorIdControl.setValue('');
  }
}
