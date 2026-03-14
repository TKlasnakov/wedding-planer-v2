import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { filter } from 'rxjs';
import { GuestService } from '../guests/services/guest.service';
import { RsvpStatus } from '../guests/models/rsvp-status.model';
import { RsvpFormDialogComponent } from './rsvp-form-dialog/rsvp-form-dialog.component';

@Component({
  selector: 'app-rsvp-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './rsvp-page.component.html',
  styleUrl: './rsvp-page.component.scss',
})
export class RsvpPageComponent {
  private readonly guestService = inject(GuestService);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);

  private readonly guestId = this.route.snapshot.paramMap.get('id') ?? '';

  protected readonly guest = computed(() =>
    this.guestService.guests().find(guest => guest.id === this.guestId) ?? null,
  );

  protected readonly submitted = signal(false);
  protected readonly RsvpStatus = RsvpStatus;

  // Wedding details — update these for the actual event
  protected readonly weddingDate = 'September 18, 2026';
  protected readonly schedule = [
    { icon: 'wine_bar',    label: 'Welcome',  time: '16:30' },
    { icon: 'favorite',    label: 'Ceremony', time: '17:00' },
    { icon: 'restaurant',  label: 'Dinner',   time: 'When it starts, it starts' },
  ];
  protected readonly venueName = 'Utopia Forrest, Burgas';
  protected readonly venueMapUrl = 'https://maps.google.com/?q=Utopia+Forrest+Burgas';

  protected openRsvpDialog(): void {
    const guest = this.guest();
    if (!guest) return;

    this.dialog
      .open(RsvpFormDialogComponent, {
        data: guest,
        maxWidth: '680px',
        width: '100%',
      })
      .afterClosed()
      .pipe(filter(result => result === true))
      .subscribe(() => {
        this.submitted.set(true);
      });
  }
}
