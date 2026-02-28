import { Injectable, computed, inject, signal } from '@angular/core';
import { GuestService } from './guest.service';
import { RsvpStatus } from '../models/rsvp-status.model';

@Injectable({ providedIn: 'root' })
export class GuestFilterService {
  private readonly guestService = inject(GuestService);

  readonly searchQuery = signal('');
  readonly statusFilter = signal<RsvpStatus | 'all'>('all');

  readonly filteredGuests = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const status = this.statusFilter();

    if (status === 'all' && !query) {
      return this.guestService.guests();
    }

    return this.guestService.guests().filter(guest => {
      const matchesStatus = status === 'all' || guest.rsvpStatus === status;
      const matchesQuery =
        !query ||
        guest.firstName.toLowerCase().includes(query) ||
        guest.lastName.toLowerCase().includes(query) ||
        guest.email.toLowerCase().includes(query);
      return matchesStatus && matchesQuery;
    });
  });

  readonly totalGuests = computed(() => this.guestService.guests().length);

  readonly confirmedCount = computed(
    () => this.guestService.guests().filter(guest => guest.rsvpStatus === RsvpStatus.Confirmed).length,
  );

  readonly pendingCount = computed(
    () => this.guestService.guests().filter(guest => guest.rsvpStatus === RsvpStatus.Pending).length,
  );

  readonly declinedCount = computed(
    () => this.guestService.guests().filter(guest => guest.rsvpStatus === RsvpStatus.Declined).length,
  );

  readonly totalAttendees = computed(() =>
    this.guestService
      .guests()
      .filter(guest => guest.rsvpStatus === RsvpStatus.Confirmed)
      .reduce((total, guest) => total + (guest.plusOne ? 2 : 1), 0),
  );
}
