import { Component, input } from '@angular/core';
import { EntryPreview } from '../../../pages/models/models';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-entry-card',
  imports: [DatePipe],
  templateUrl: './entry-card.ui.html',
  styleUrl: './entry-card.ui.scss',
})
export class EntryCard {
  entry = input.required<EntryPreview>();
}
