import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  imports: [
    MatButtonModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private breakpointObserver = inject(BreakpointObserver);
  private sidenav = viewChild.required(MatSidenav);
  protected readonly title = signal('Reflecta');
  protected readonly isMobile = toSignal(
    this.breakpointObserver.observe('(max-width: 900px)').pipe(map((state) => state.matches)),
    { initialValue: false },
  );
  protected readonly sidenavMode = computed(() => (this.isMobile() ? 'over' : 'side'));
  protected readonly sidenavOpened = computed(() => !this.isMobile());

  toggleSidenav() {
    this.sidenav().toggle();
  }

  closeSidenavOnMobile() {
    if (this.isMobile()) {
      this.sidenav().close();
    }
  }
}
