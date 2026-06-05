import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PageService } from '../../services/page.service';
import { getAuthorId } from '../../../config/api.config';

const todayLocalIso = (): string => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
};

@Component({
  selector: 'app-write',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './write.page.html',
  styleUrl: './write.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WritePage {
  private router = inject(Router);
  private pageService = inject(PageService);
  private snackBar = inject(MatSnackBar);

  readonly MAX_CONTENT_LENGTH = 5000;
  readonly MAX_TITLE_LENGTH = 120;

  authorId = signal<string>(getAuthorId());
  isSubmitting = signal(false);

  form = new FormGroup({
    title: new FormControl('', { nonNullable: true }),
    date: new FormControl(todayLocalIso(), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    content: new FormControl('', { nonNullable: true }),
  });

  get titleValue(): string {
    return (this.form.controls.title.value ?? '').trim();
  }

  get contentValue(): string {
    return (this.form.controls.content.value ?? '').trim();
  }

  get charCount(): number {
    return this.contentValue.length;
  }

  get isOverLimit(): boolean {
    return this.charCount > this.MAX_CONTENT_LENGTH;
  }

  get isNearLimit(): boolean {
    return this.charCount > this.MAX_CONTENT_LENGTH * 0.9;
  }

  get isTitleOverLimit(): boolean {
    return this.titleValue.length > this.MAX_TITLE_LENGTH;
  }

  get hasAuthorId(): boolean {
    return Boolean(this.authorId().trim());
  }

  get canSubmit(): boolean {
    return (
      Boolean(this.titleValue) &&
      Boolean(this.contentValue) &&
      Boolean(this.form.controls.date.value) &&
      this.hasAuthorId &&
      !this.isOverLimit &&
      !this.isTitleOverLimit &&
      !this.isSubmitting()
    );
  }

  onSubmit() {
    const title = this.titleValue;
    const content = this.contentValue;
    const date = this.form.controls.date.value;

    const authorId = getAuthorId().trim();
    this.authorId.set(authorId);

    if (!authorId) {
      this.showSnack('Imposta l\'Author ID nelle Impostazioni.', 'warn');
      return;
    }

    if (!title) {
      this.showSnack('Dai un titolo a questa voce.', 'warn');
      return;
    }

    if (!content) {
      this.showSnack('Scrivi qualcosa prima di salvare.', 'warn');
      return;
    }

    this.isSubmitting.set(true);

    firstValueFrom(
      this.pageService.createEntry({ authorId, title, date, content }),
    )
      .then(() => {
        this.form.reset({ title: '', date: todayLocalIso(), content: '' });
        this.showSnack('Voce salvata nel diario.', 'success', 'Apri l\'archivio');
      })
      .catch(() => {
        this.showSnack('Impossibile salvare la voce.', 'danger');
      })
      .finally(() => {
        this.isSubmitting.set(false);
      });
  }

  private showSnack(message: string, tone: 'success' | 'warn' | 'danger', action?: string) {
    const ref = this.snackBar.open(message, action, {
      duration: action ? 5000 : 3500,
      panelClass: ['rf-snackbar', `rf-snackbar--${tone}`],
    });

    if (action) {
      ref.onAction().subscribe(() => {
        this.router.navigate(['/entries']);
      });
    }
  }
}
