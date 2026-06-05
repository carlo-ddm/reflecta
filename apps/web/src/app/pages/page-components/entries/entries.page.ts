import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PageService } from '../../services/page.service';
import { EntryCard } from '../../../ui/ui-components/entry-card/entry-card.ui';
import { hasActiveFilters } from '../../models/models';

@Component({
  selector: 'app-entries',
  imports: [
    EntryCard,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './entries.page.html',
  styleUrl: './entries.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntriesPage implements OnInit {
  private pageService = inject(PageService);
  protected readonly entryPreviewList = this.pageService.getEntryList();
  protected readonly isLoading = this.pageService.isLoading();
  protected readonly errorMessage = this.pageService.errorMessage();
  protected readonly hasMore = this.pageService.getHasMore();
  protected readonly isLoadingMore = this.pageService.isLoadingMore;
  protected readonly total = this.pageService.getTotal();
  protected readonly filters = this.pageService.getFilters();
  protected readonly filtersActive = computed(() => hasActiveFilters(this.filters()));

  form = new FormGroup({
    q: new FormControl('', { nonNullable: true }),
    from: new FormControl('', { nonNullable: true }),
    to: new FormControl('', { nonNullable: true }),
  });

  constructor() {
    this.form.valueChanges.pipe(debounceTime(300), takeUntilDestroyed()).subscribe(() => {
      const { q, from, to } = this.form.getRawValue();
      this.pageService.applyFilters({ q, from, to });
    });
  }

  ngOnInit(): void {
    this.pageService.loadEntries();
  }

  onClear(): void {
    this.form.reset({ q: '', from: '', to: '' });
  }

  onLoadMore(): void {
    this.pageService.loadMore();
  }
}
