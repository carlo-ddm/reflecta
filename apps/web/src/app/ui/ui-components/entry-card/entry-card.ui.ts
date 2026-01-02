import { Component, input } from '@angular/core';
import { EntryListItem } from '../../../pages/models/models';
import { DatePipe } from '@angular/common';
import { Badge } from '../badge/badge.ui';

@Component({
  selector: 'app-entry-card',
  imports: [DatePipe, Badge],
  templateUrl: './entry-card.ui.html',
  styleUrl: './entry-card.ui.scss',
})
export class EntryCard {
  entry = input.required<EntryListItem>();
}
