import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
  private entryService = inject(PageService);
  entry = signal<EntryDetail | null>(null);
  hasAnalysis = computed(() => Boolean(this.entry()?.analysis));

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
}
