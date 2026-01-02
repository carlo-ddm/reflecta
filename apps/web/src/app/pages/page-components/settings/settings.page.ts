import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { getAuthorId, setAuthorId } from '../../../config/api.config';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule],
  templateUrl: './settings.page.html',
  styleUrl: './settings.page.scss',
})
export class SettingsPage {
  authorIdControl = new FormControl(getAuthorId());
  authorIdVisible = signal<boolean>(false);
  showRemoveConfirm = signal<boolean>(false);

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
    this.showRemoveConfirm.set(true);
  }

  closeRemoveConfirm() {
    this.showRemoveConfirm.set(false);
  }

  confirmRemoveAuthorId() {
    setAuthorId('');
    this.authorIdControl.setValue('');
    this.showRemoveConfirm.set(false);
  }
}
