import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { PageService } from '../../services/page.service';
import { EntryCard } from '../../../ui/ui-components/entry-card/entry-card.ui';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-entries',
  imports: [EntryCard, MatCardModule, RouterLink],
  templateUrl: './entries.page.html',
  styleUrl: './entries.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntriesPage implements OnInit {
  private pageService = inject(PageService);
  protected readonly entryPreviewList = this.pageService.getEntryList();
  protected readonly isLoading = this.pageService.isLoading();
  protected readonly errorMessage = this.pageService.errorMessage();

  ngOnInit(): void {
    this.pageService.loadEntries();
  }
}
