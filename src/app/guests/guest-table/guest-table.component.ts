import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Guest } from '../models/guest.model';
import { GuestService } from '../services/guest.service';
import { GuestFilterService } from '../services/guest-filter.service';
import { GuestFormComponent } from '../guest-form/guest-form.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { GUEST_DISPLAYED_COLUMNS } from '../guest.constants';

@Component({
  selector: 'app-guest-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatTooltipModule,
  ],
  templateUrl: './guest-table.component.html',
  styleUrl: './guest-table.component.scss',
})
export class GuestTableComponent {
  private readonly guestService = inject(GuestService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly filterService = inject(GuestFilterService);
  protected readonly displayedColumns = GUEST_DISPLAYED_COLUMNS;

  protected onSearchChange(query: string): void {
    this.filterService.searchQuery.set(query);
  }

  protected openAddDialog(): void {
    this.dialog
      .open(GuestFormComponent, { data: null, width: '600px', maxWidth: '95vw' })
      .afterClosed()
      .subscribe((result) => {
        if (!result) return;
        this.guestService.addGuest(result).subscribe({
          next: () => this.snackBar.open('Guest added!', 'Close', { duration: 3000 }),
          error: () => this.snackBar.open('Failed to add guest.', 'Close', { duration: 3000 }),
        });
      });
  }

  protected openEditDialog(guest: Guest): void {
    this.dialog
      .open(GuestFormComponent, { data: guest, width: '600px', maxWidth: '95vw' })
      .afterClosed()
      .subscribe((result) => {
        if (!result) return;
        this.guestService.updateGuest(guest.id, result).subscribe({
          next: () => this.snackBar.open('Guest updated!', 'Close', { duration: 3000 }),
          error: () => this.snackBar.open('Failed to update guest.', 'Close', { duration: 3000 }),
        });
      });
  }

  protected deleteGuest(guest: Guest): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: 'Remove Guest',
          message: `Are you sure you want to remove ${guest.firstName} ${guest.lastName}?`,
          confirmLabel: 'Remove',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.guestService.deleteGuest(guest.id).subscribe({
          next: () => this.snackBar.open('Guest removed.', 'Close', { duration: 3000 }),
          error: () => this.snackBar.open('Failed to remove guest.', 'Close', { duration: 3000 }),
        });
      });
  }

  protected copyRsvpLink(guest: Guest): void {
    const link = `${window.location.origin}/rsvp/${guest.id}`;
    navigator.clipboard.writeText(link).then(() => {
      this.snackBar.open('RSVP link copied!', 'Close', { duration: 3000 });
    });
  }

  protected getPlusOneName(guest: Guest): string {
    return guest.plusOne ? (guest.plusOneName ?? '') : '';
  }
}
