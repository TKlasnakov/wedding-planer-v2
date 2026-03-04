import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { filter, switchMap, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { GuestService } from '../guests/services/guest.service';
import { Guest } from '../guests/models/guest.model';
import { RsvpStatus } from '../guests/models/rsvp-status.model';
import { TableService } from './services/table.service';
import { Table } from './models/table.model';
import { TableFormComponent, TableFormData } from './table-form/table-form.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../shared/confirm-dialog/confirm-dialog.component';
import { ChartHeaderComponent } from './chart-header/chart-header.component';
import { UnassignedGuestsComponent } from './unassigned-guests/unassigned-guests.component';
import { TablesGridComponent } from './tables-grid/tables-grid.component';

@Component({
  selector: 'app-tables',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChartHeaderComponent, UnassignedGuestsComponent, TablesGridComponent],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.scss',
})
export class TablesComponent {
  private readonly guestService = inject(GuestService);
  private readonly tableService = inject(TableService);
  private readonly dialog = inject(MatDialog);

  protected readonly tables = this.tableService.tables;

  protected readonly guestsByTable = computed(() => {
    const map = new Map<string | null, Guest[]>();
    map.set(null, []);
    for (const table of this.tables()) {
      map.set(table.id, []);
    }
    for (const guest of this.guestService.guests().filter(guest => guest.rsvpStatus !== RsvpStatus.Declined)) {
      const key = guest.tableId != null && map.has(guest.tableId) ? guest.tableId : null;
      map.get(key)!.push(guest);
    }
    return map;
  });

  protected readonly allDropListIds = computed(() => [
    'unassigned',
    ...this.tables().map(table => `table-${table.id}`),
  ]);

  protected onDrop(event: CdkDragDrop<Guest[]>, targetTable: Table | null): void {
    if (event.previousContainer === event.container) return;
    const guest: Guest = event.item.data;
    this.guestService.updateGuest(guest.id, { ...guest, tableId: targetTable?.id ?? null }).subscribe();
  }

  protected openAddTable(): void {
    this.dialog
      .open<TableFormComponent, TableFormData>(TableFormComponent, { data: {} })
      .afterClosed()
      .pipe(
        filter(result => !!result),
        switchMap(result => this.tableService.addTable(result)),
      )
      .subscribe();
  }

  protected openEditTable(table: Table): void {
    this.dialog
      .open<TableFormComponent, TableFormData>(TableFormComponent, { data: { table } })
      .afterClosed()
      .pipe(
        filter(result => !!result),
        switchMap(result => this.tableService.updateTable(table.id, result)),
      )
      .subscribe();
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
      .pipe(
        filter(confirmed => !!confirmed),
        switchMap(() => {
          const assignedGuestIds = this.guestService.guests()
            .filter(guest => guest.tableId === table.id)
            .map(guest => guest.id);
          return this.tableService.deleteTable(table.id).pipe(
            tap(() => this.guestService.clearTableAssignment(assignedGuestIds)),
          );
        }),
      )
      .subscribe();
  }
}
