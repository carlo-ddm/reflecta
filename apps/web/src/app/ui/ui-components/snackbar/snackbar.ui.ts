import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-snackbar',
  imports: [],
  templateUrl: './snackbar.ui.html',
  styleUrl: './snackbar.ui.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Snackbar {}
