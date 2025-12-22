import { Component, inject } from '@angular/core';
import { PageService } from '../../services/page.service';
import { EntryCard } from '../../../UI/ui-components/entry-card/entry-card.ui';

@Component({
  selector: 'app-entries',
  imports: [EntryCard],
  templateUrl: './entries.page.html',
  styleUrl: './entries.page.scss',
})
export class EntriesPage {
  private pageService = inject(PageService);
  protected readonly entryPreviewList = this.pageService.getEntryList()
}
