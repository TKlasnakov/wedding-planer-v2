import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'header[appChartHeader]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <h2 class="chart-title">Seating Chart</h2>
    <button mat-raised-button color="primary" (click)="addTable.emit()">
      <mat-icon>add</mat-icon>
      Add Table
    </button>
  `,
  styleUrl: './chart-header.component.scss',
})
export class ChartHeaderComponent {
  readonly addTable = output<void>();
}
