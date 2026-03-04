import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-stat-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, MatButtonModule, MatCardModule, MatIconModule, MatTooltipModule],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss',
})
export class StatCardComponent {
  readonly value = input.required<number>();
  readonly label = input.required<string>();
  readonly borderColor = input('#bdbdbd');
  readonly currencyCode = input<string | null>(null);
  readonly actionIcon = input<string | null>(null);
  readonly actionTooltip = input('');
  readonly clickable = input(false);
  readonly actionClick = output<void>();
  readonly cardClick = output<void>();
}
