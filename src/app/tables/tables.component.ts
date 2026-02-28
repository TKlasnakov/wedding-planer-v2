import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GuestService } from '../guests/services/guest.service';
import { Guest } from '../guests/models/guest.model';
import { RsvpStatus } from '../guests/models/rsvp-status.model';
import { TableService } from './services/table.service';
import { Table } from './models/table.model';
import { TableFormComponent, TableFormData } from './table-form/table-form.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-tables',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DragDropModule, MatButtonModule, MatCardModule, MatIconModule, MatTooltipModule],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.scss',
})
export class TablesComponent {
  private readonly guestService = inject(GuestService);
  private readonly tableService = inject(TableService);
  private readonly dialog = inject(MatDialog);

  protected readonly tables = this.tableService.tables;

  protected readonly guestsByTable = computed(() => {
    const map = new Map<number | null, Guest[]>();
    map.set(null, []);
    for (const table of this.tables()) {
      map.set(table.number, []);
    }
    for (const guest of this.guestService.guests().filter(guest => guest.rsvpStatus === RsvpStatus.Confirmed)) {
      const key = guest.tableNumber !== null && map.has(guest.tableNumber) ? guest.tableNumber : null;
      map.get(key)!.push(guest);
    }
    return map;
  });

  protected readonly allDropListIds = computed(() => [
    'unassigned',
    ...this.tables().map(table => `table-${table.id}`),
  ]);

  protected attendeeCount(guests: Guest[]): number {
    return guests.reduce((total, guest) => total + (guest.plusOne ? 2 : 1), 0);
  }

  protected onDrop(event: CdkDragDrop<Guest[]>, targetTableNumber: number | null): void {
    if (event.previousContainer === event.container) return;
    const guest: Guest = event.item.data;
    this.guestService.updateGuest(guest.id, { ...guest, tableNumber: targetTableNumber });
  }

  protected openAddTable(): void {
    this.dialog
      .open<TableFormComponent, TableFormData>(TableFormComponent, { data: {} })
      .afterClosed()
      .subscribe(result => {
        if (result) this.tableService.addTable(result);
      });
  }

  protected openEditTable(table: Table): void {
    this.dialog
      .open<TableFormComponent, TableFormData>(TableFormComponent, { data: { table } })
      .afterClosed()
      .subscribe(result => {
        if (result) this.tableService.updateTable(table.id, result);
      });
  }

  protected deleteTable(table: Table): void {
    this.dialog
      .open<ConfirmDialogComponent, ConfirmDialogData>(ConfirmDialogComponent, {
        data: {
          title: 'Remove Table',
          message: `Remove "${table.name}"? Guests assigned to it will become unassigned.`,
          confirmLabel: 'Remove',
        },
      })
      .afterClosed()
      .subscribe(confirmed => {
        if (!confirmed) return;
        this.guestService
          .guests()
          .filter(guest => guest.tableNumber === table.number)
          .forEach(guest =>
            this.guestService.updateGuest(guest.id, { ...guest, tableNumber: null }),
          );
        this.tableService.deleteTable(table.id);
      });
  }
}
