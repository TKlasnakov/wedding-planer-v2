import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GuestStatsComponent } from './guest-stats/guest-stats.component';
import { GuestTableComponent } from './guest-table/guest-table.component';

@Component({
  selector: 'app-guest',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GuestStatsComponent, GuestTableComponent],
  templateUrl: './guest.component.html',
  styleUrl: './guest.component.scss',
})
export class GuestComponent {}
