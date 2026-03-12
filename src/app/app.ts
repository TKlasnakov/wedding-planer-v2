import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, NavigationStart, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatToolbarModule, MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly router = inject(Router);

  protected readonly isShelllessRoute = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationStart || event instanceof NavigationEnd),
      map((event) => {
        const url = event instanceof NavigationEnd ? event.urlAfterRedirects : event.url;
        return url.startsWith('/rsvp/') || url.startsWith('/login');
      }),
    ),
    { initialValue: window.location.pathname.startsWith('/rsvp/') || window.location.pathname.startsWith('/login') },
  );
}
