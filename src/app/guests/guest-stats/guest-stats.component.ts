import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GuestFilterService } from '../services/guest-filter.service';
import { StatCardComponent } from '../../shared/stat-card/stat-card.component';
import { RsvpStatus } from '../models/rsvp-status.model';

@Component({
  selector: 'app-guest-stats',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StatCardComponent],
  templateUrl: './guest-stats.component.html',
  styleUrl: './guest-stats.component.scss',
})
export class GuestStatsComponent {
  protected readonly filterService = inject(GuestFilterService);

  protected onStatusChange(status: RsvpStatus | 'all'): void {
    this.filterService.statusFilter.set(status);
  }
}
