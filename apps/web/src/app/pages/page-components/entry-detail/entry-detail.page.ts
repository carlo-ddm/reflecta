import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  ANALYSIS_METRIC_LABELS,
  ANALYSIS_METRIC_ORDER,
  EntryDetail,
} from '../../models/models';
import { PageService } from '../../services/page.service';
import { Badge } from '../../../ui/ui-components/badge/badge.ui';
import { ConfirmDialog } from '../../../ui/ui-components/confirm-dialog/confirm-dialog.ui';

@Component({
  selector: 'app-entry-detail',
  imports: [
    Badge,
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
  hasAnalysis = computed(() => Boolean(this.entry()?.analysis));
  isDeleting = signal(false);

  analysisMetrics = computed(() => {
    const analysis = this.entry()?.analysis;
    if (!analysis) return [];

    const scoreMap = new Map(analysis.metrics.map((metric) => [metric.key, metric.score]));

    return ANALYSIS_METRIC_ORDER.map((key) => {
      const rawScore = scoreMap.get(key) ?? null;
      const percent = rawScore === null ? null : Math.round(rawScore * 100);

      return {
        key,
        label: ANALYSIS_METRIC_LABELS[key],
        value: percent,
        pct: percent,
      };
    });
  });

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (!id) return;

    firstValueFrom(this.entryService.getEntry(id))
      .then((entry) => {
        this.entry.set({
          ...entry,
          hasAnalysis: Boolean(entry.analysis),
        });
      })
      .catch(() => {
        this.entry.set(null);
      });
  }

  openDeleteDialog() {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      panelClass: 'rf-dialog',
      autoFocus: false,
      data: {
        title: 'Eliminare questa entry?',
        message: 'Questa azione e irreversibile.',
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
        this.snackBar.open('Impossibile eliminare l\'entry.', undefined, {
          duration: 3500,
          panelClass: ['rf-snackbar', 'rf-snackbar--danger'],
        });
      })
      .finally(() => {
        this.isDeleting.set(false);
      });
  }
}
