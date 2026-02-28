import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
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
  @Input({ required: true }) value: number = 0;
  @Input({ required: true }) label = '';
  @Input() borderColor = '#bdbdbd';
  @Input() currencyCode: string | null = null;
  @Input() actionIcon: string | null = null;
  @Input() actionTooltip = '';
  @Output() actionClick = new EventEmitter<void>();
}
