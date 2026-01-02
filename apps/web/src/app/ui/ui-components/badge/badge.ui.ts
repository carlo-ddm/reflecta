import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-badge',
  imports: [],
  template: ` <span
    [class]="[
      'entry-detail__badge',
      hasAnalysis() ? 'entry-detail__badge--analysis' : 'entry-detail__badge--empty'
    ]"
    >{{ hasAnalysis() ? 'Analisi presente' : 'Analisi non presente' }}</span
  >`,
  styles: [
    `
      .entry-detail__badge {
        flex: none;
        display: inline-flex;
        align-items: center;
        padding: 0.25rem 0.6rem;
        border-radius: 999px;
        border: 1px solid var(--border-1);
        background: color-mix(in srgb, var(--surface-1) 92%, var(--app-bg));
        font-size: 0.82rem;
        letter-spacing: -0.01em;
      }

      .entry-detail__badge--analysis {
        border-color: color-mix(in srgb, var(--brand-1) 26%, var(--border-1));
        background: color-mix(in srgb, var(--brand-1) 10%, var(--surface-1));
        color: var(--brand-1);
      }

      .entry-detail__badge--empty {
        border-style: dashed;
        opacity: 0.7;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Badge {
  hasAnalysis = input<boolean>();
}
