import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GuestStatsComponent } from './guest-stats/guest-stats.component';
import { GuestTableComponent } from './guest-table/guest-table.component';

@Component({
  selector: 'app-guest-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GuestStatsComponent, GuestTableComponent],
  templateUrl: './guest-list.component.html',
  styleUrl: './guest-list.component.scss',
})
export class GuestListComponent {}
