import { Component, inject, OnInit } from '@angular/core';
import { PageService } from '../../services/page.service';
import { EntryCard } from '../../../ui/ui-components/entry-card/entry-card.ui';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-entries',
  imports: [EntryCard, RouterLink],
  templateUrl: './entries.page.html',
  styleUrl: './entries.page.scss',
})
export class EntriesPage implements OnInit {
  private pageService = inject(PageService);
  protected readonly entryPreviewList = this.pageService.getEntryList();

  ngOnInit(): void {
    this.pageService.loadEntries();
  }
}
