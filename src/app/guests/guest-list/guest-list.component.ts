import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  effect,
  inject,
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

import { Guest } from '../models/guest.model';
import { RsvpStatus } from '../models/rsvp-status.model';
import { GuestService } from '../services/guest.service';
import { GuestFilterService } from '../services/guest-filter.service';
import { GuestFormComponent } from '../guest-form/guest-form.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { GUEST_DISPLAYED_COLUMNS, GUEST_STATUS_OPTIONS } from './guest-list.constants';

@Component({
  selector: 'app-guest-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatCardModule,
    MatSelectModule,
  ],
  templateUrl: './guest-list.component.html',
  styleUrl: './guest-list.component.scss',
})
export class GuestListComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;

  private readonly guestService = inject(GuestService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly filterService = inject(GuestFilterService);

  readonly displayedColumns = GUEST_DISPLAYED_COLUMNS;
  readonly statusOptions = GUEST_STATUS_OPTIONS;
  readonly dataSource = new MatTableDataSource<Guest>([]);

  constructor() {
    effect(() => {
      this.dataSource.data = this.filterService.filteredGuests();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  onSearchChange(query: string): void {
    this.filterService.searchQuery.set(query);
  }

  onStatusChange(status: RsvpStatus | 'all'): void {
    this.filterService.statusFilter.set(status);
  }

  openAddDialog(): void {
    this.dialog
      .open(GuestFormComponent, { data: null, width: '600px', maxWidth: '95vw' })
      .afterClosed()
      .subscribe(result => {
        if (!result) return;
        this.guestService.addGuest(result);
        this.snackBar.open('Guest added!', 'Close', { duration: 3000 });
      });
  }

  openEditDialog(guest: Guest): void {
    this.dialog
      .open(GuestFormComponent, { data: guest, width: '600px', maxWidth: '95vw' })
      .afterClosed()
      .subscribe(result => {
        if (!result) return;
        this.guestService.updateGuest(guest.id, result);
        this.snackBar.open('Guest updated!', 'Close', { duration: 3000 });
      });
  }

  deleteGuest(guest: Guest): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: 'Remove Guest',
          message: `Are you sure you want to remove ${guest.firstName} ${guest.lastName}?`,
          confirmLabel: 'Remove',
        },
      })
      .afterClosed()
      .subscribe(confirmed => {
        if (!confirmed) return;
        this.guestService.deleteGuest(guest.id);
        this.snackBar.open('Guest removed.', 'Close', { duration: 3000 });
      });
  }

  copyRsvpLink(guest: Guest): void {
    const link = `${window.location.origin}/rsvp/${guest.id}`;
    navigator.clipboard.writeText(link).then(() => {
      this.snackBar.open('RSVP link copied!', 'Close', { duration: 3000 });
    });
  }

  getPlusOneName(guest: Guest): string {
    return guest.plusOne ? (guest.plusOneName ?? '') : '';
  }
}
