import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Guest } from '../../guests/models/guest.model';
import { Table } from '../models/table.model';

@Component({
  selector: 'app-tables-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DragDropModule, MatButtonModule, MatCardModule, MatIconModule, MatTooltipModule],
  templateUrl: './tables-grid.component.html',
  styleUrl: './tables-grid.component.scss',
})
export class TablesGridComponent {
  readonly tables = input.required<Table[]>();
  readonly guestsByTable = input.required<Map<string | null, Guest[]>>();
  readonly connectedTo = input.required<string[]>();
  readonly dropped = output<{ event: CdkDragDrop<Guest[]>; table: Table }>();
  readonly editTable = output<Table>();
  readonly deleteTable = output<Table>();

  protected attendeeCount(guests: Guest[]): number {
    return guests.reduce((total, guest) => total + (guest.plusOne ? 2 : 1), 0);
  }

  protected emitDrop(event: CdkDragDrop<Guest[]>, table: Table): void {
    this.dropped.emit({ event, table });
  }
}
