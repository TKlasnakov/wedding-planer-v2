import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { GuestService } from '../../guests/services/guest.service';
import { Guest } from '../../guests/models/guest.model';
import { DietaryRestriction } from '../../guests/models/dietary-restriction.model';
import { RsvpStatus } from '../../guests/models/rsvp-status.model';
import { DIETARY_OPTIONS } from '../../guests/guest-form/guest-form.constants';

@Component({
  selector: 'app-rsvp-form-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './rsvp-form-dialog.component.html',
  styleUrl: './rsvp-form-dialog.component.scss',
})
export class RsvpFormDialogComponent implements OnInit {
  private readonly guestService = inject(GuestService);
  private readonly dialogRef = inject(MatDialogRef<RsvpFormDialogComponent>);
  protected readonly guest: Guest = inject(MAT_DIALOG_DATA);

  private readonly fb = inject(FormBuilder);

  protected readonly showPlusOneName = signal(false);
  protected readonly rsvpOptions = [
    { value: RsvpStatus.Confirmed, label: 'Confirm' },
    { value: RsvpStatus.Declined, label: 'Decline' },
  ];
  protected readonly dietaryOptions = DIETARY_OPTIONS;

  protected readonly form = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.email]],
    phone: [''],
    rsvpStatus: [RsvpStatus.Confirmed, Validators.required],
    dietaryRestriction: [<DietaryRestriction>'none', Validators.required],
    allergies: [''],
    kidsUnder14: [0, [Validators.min(0)]],
    notes: [''],
    plusOne: [false],
    plusOneName: [''],
  });

  ngOnInit(): void {
    this.form.patchValue(this.guest);
    this.showPlusOneName.set(this.guest.plusOne);

    this.form.controls.plusOne.valueChanges.subscribe(hasPlusOne => {
      this.showPlusOneName.set(!!hasPlusOne);
      if (!hasPlusOne) {
        this.form.controls.plusOneName.setValue('');
      }
    });
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { plusOne, plusOneName, kidsUnder14, ...rest } = this.form.getRawValue();
    const updated: Omit<Guest, 'id'> = {
      firstName: rest.firstName ?? '',
      lastName: rest.lastName ?? '',
      email: rest.email ?? '',
      phone: rest.phone ?? '',
      rsvpStatus: rest.rsvpStatus ?? RsvpStatus.Pending,
      dietaryRestriction: rest.dietaryRestriction ?? 'none',
      allergies: rest.allergies ?? '',
      kidsUnder14: Number(kidsUnder14) || 0,
      notes: rest.notes ?? '',
      plusOne: !!plusOne,
      plusOneName: plusOne && plusOneName ? plusOneName : undefined,
      tableId: this.guest.tableId,
    };

    this.guestService.updateGuest(this.guest.id, updated).subscribe(() => {
      this.dialogRef.close(true);
    });
  }
}
