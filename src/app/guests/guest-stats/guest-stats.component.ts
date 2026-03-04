import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GuestFilterService } from '../services/guest-filter.service';
import { StatCardComponent } from '../../shared/stat-card/stat-card.component';
import { RsvpStatus } from '../models/rsvp-status.model';

@Component({
  selector: 'app-guest-stats',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StatCardComponent],
  template: `
    <div class="stats-row">
      <app-stat-card [value]="filterService.totalGuests()" label="Total Guests" [clickable]="true" (cardClick)="onStatusChange('all')" />
      <app-stat-card [value]="filterService.confirmedCount()" label="Confirmed" borderColor="#4caf50" [clickable]="true" (cardClick)="onStatusChange(RsvpStatus.Confirmed)" />
      <app-stat-card [value]="filterService.pendingCount()" label="Pending" borderColor="#ff9800" [clickable]="true" (cardClick)="onStatusChange(RsvpStatus.Pending)" />
      <app-stat-card [value]="filterService.declinedCount()" label="Declined" borderColor="#f44336" [clickable]="true" (cardClick)="onStatusChange(RsvpStatus.Declined)" />
      <app-stat-card [value]="filterService.totalAttendees()" label="Total Attendees" borderColor="#9c27b0" [clickable]="true" (cardClick)="onStatusChange(RsvpStatus.Confirmed)" />
    </div>
  `,
  styleUrl: './guest-stats.component.scss',
})
export class GuestStatsComponent {
  protected readonly filterService = inject(GuestFilterService);
  protected readonly RsvpStatus = RsvpStatus;

  protected onStatusChange(status: RsvpStatus | 'all'): void {
    this.filterService.statusFilter.set(status);
  }
}
