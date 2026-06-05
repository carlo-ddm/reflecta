import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EntryDetail } from '../../models/models';
import { PageService } from '../../services/page.service';
import { ConfirmDialog } from '../../../ui/ui-components/confirm-dialog/confirm-dialog.ui';

@Component({
  selector: 'app-entry-detail',
  imports: [
    DatePipe,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    RouterLink,
  ],
  templateUrl: './entry-detail.page.html',
  styleUrl: './entry-detail.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntryDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private entryService = inject(PageService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  entry = signal<EntryDetail | null>(null);
  isLoading = signal(true);
  hasError = signal(false);
  isDeleting = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (!id) {
      this.isLoading.set(false);
      this.hasError.set(true);
      return;
    }

    firstValueFrom(this.entryService.getEntry(id))
      .then((entry) => {
        this.entry.set(entry);
      })
      .catch(() => {
        this.entry.set(null);
        this.hasError.set(true);
      })
      .finally(() => {
        this.isLoading.set(false);
      });
  }

  openDeleteDialog() {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      panelClass: 'rf-dialog',
      autoFocus: false,
      data: {
        title: 'Eliminare questa voce?',
        message: 'Questa azione è irreversibile.',
        confirmLabel: 'Elimina',
        cancelLabel: 'Annulla',
        tone: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.confirmDelete();
      }
    });
  }

  private confirmDelete() {
    const entry = this.entry();
    if (!entry || this.isDeleting()) return;

    this.isDeleting.set(true);

    firstValueFrom(this.entryService.deleteEntry(entry.id))
      .then(() => {
        this.router.navigate(['/entries']);
      })
      .catch(() => {
        this.snackBar.open('Impossibile eliminare la voce.', undefined, {
          duration: 3500,
          panelClass: ['rf-snackbar', 'rf-snackbar--danger'],
        });
      })
      .finally(() => {
        this.isDeleting.set(false);
      });
  }
}
