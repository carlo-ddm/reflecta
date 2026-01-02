import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PageService } from '../../services/page.service';
import { getAuthorId } from '../../../config/api.config';
import { AnalysisDialog } from './analysis-dialog.ui';

@Component({
  selector: 'app-write',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    ReactiveFormsModule,
  ],
  templateUrl: './write.page.html',
  styleUrl: './write.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WritePage {
  private router = inject(Router);
  private pageService = inject(PageService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  form = new FormGroup({
    ['entry-text']: new FormControl(''),
  });
  authorId = signal<string>(getAuthorId());

  get hasContent(): boolean {
    const value = this.form.get('entry-text')?.value ?? '';
    return String(value).trim().length > 0;
  }

  get hasAuthorId(): boolean {
    return Boolean(this.authorId().trim());
  }

  openAnalysisDialog() {
    if (!this.hasContent || !this.hasAuthorId) return;

    const dialogRef = this.dialog.open(AnalysisDialog, {
      panelClass: 'rf-dialog',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.onSubmitAnalysis();
      }
    });
  }

  onSubmit() {
    const rawContent = this.form.get('entry-text')?.value ?? '';
    const content = String(rawContent).trim();

    if (!content) {
      this.showSnack('Scrivi qualcosa prima di salvare.', 'warn');
      return;
    }

    const authorId = getAuthorId().trim();
    this.authorId.set(authorId);

    if (!authorId) {
      this.showSnack('Imposta l\'Author ID nelle impostazioni.', 'warn');
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
        this.showSnack('Entry salvata con successo.', 'success', 'Vai a Entries');
      })
      .catch(() => {
        this.showSnack('Impossibile salvare l\'entry.', 'danger');
      });
  }

  onSubmitAnalysis() {
    const rawContent = this.form.get('entry-text')?.value ?? '';
    const content = String(rawContent).trim();

    if (!content) {
      this.showSnack('Scrivi qualcosa prima di analizzare.', 'warn');
      return;
    }

    const authorId = getAuthorId().trim();
    this.authorId.set(authorId);

    if (!authorId) {
      this.showSnack('Imposta l\'Author ID nelle impostazioni.', 'warn');
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
        this.showSnack('Entry salvata con analisi.', 'success', 'Vai a Entries');
      })
      .catch(() => {
        this.showSnack('Impossibile completare l\'analisi.', 'danger');
      });
  }

  private showSnack(
    message: string,
    tone: 'success' | 'warn' | 'danger',
    action?: string,
  ) {
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
