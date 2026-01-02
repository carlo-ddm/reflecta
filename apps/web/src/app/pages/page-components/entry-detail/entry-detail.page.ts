import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  ANALYSIS_METRIC_LABELS,
  ANALYSIS_METRIC_ORDER,
  EntryDetail,
} from '../../models/models';
import { PageService } from '../../services/page.service';
import { DatePipe } from '@angular/common';
import { Badge } from '../../../ui/ui-components/badge/badge.ui';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-entry-detail',
  imports: [DatePipe, RouterLink, Badge],
  templateUrl: './entry-detail.page.html',
  styleUrl: './entry-detail.page.scss',
})
export class EntryDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private entryService = inject(PageService);
  entry = signal<EntryDetail | null>(null);
  hasAnalysis = computed(() => Boolean(this.entry()?.analysis));
  isDeleteDialogOpen = signal(false);
  isDeleting = signal(false);
  deleteError = signal<string | null>(null);

  analysisMetrics = computed(() => {
    const analysis = this.entry()?.analysis;
    if (!analysis) return [];

    const scoreMap = new Map(
      analysis.metrics.map((metric) => [metric.key, metric.score]),
    );

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
    this.deleteError.set(null);
    this.isDeleteDialogOpen.set(true);
  }

  closeDeleteDialog() {
    this.isDeleteDialogOpen.set(false);
  }

  confirmDelete() {
    const entry = this.entry();
    if (!entry || this.isDeleting()) return;

    this.isDeleting.set(true);
    this.deleteError.set(null);

    firstValueFrom(this.entryService.deleteEntry(entry.id))
      .then(() => {
        this.router.navigate(['/entries']);
      })
      .catch(() => {
        this.deleteError.set('Impossibile eliminare l\'entry.');
      })
      .finally(() => {
        this.isDeleting.set(false);
      });
  }
}
