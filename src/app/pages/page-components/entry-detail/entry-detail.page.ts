import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EntryPreview } from '../../models/models';
import { PageService } from '../../services/page.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-entry-detail',
  imports: [DatePipe],
  templateUrl: './entry-detail.page.html',
  styleUrl: './entry-detail.page.scss',
})
export class EntryDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private entryService = inject(PageService);
  entry = signal<EntryPreview | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    const entry = this.entryService.getEntry(id);
    if (entry) this.entry.set(entry);
  }
}
