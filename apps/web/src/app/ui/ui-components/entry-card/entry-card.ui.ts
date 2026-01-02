import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { EntryListItem } from '../../../pages/models/models';
import { DatePipe } from '@angular/common';
import { Badge } from '../badge/badge.ui';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-entry-card',
  imports: [Badge, DatePipe, MatCardModule, RouterLink],
  templateUrl: './entry-card.ui.html',
  styleUrl: './entry-card.ui.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntryCard {
  entry = input.required<EntryListItem>();
  link = input.required<string | any[]>();
}
