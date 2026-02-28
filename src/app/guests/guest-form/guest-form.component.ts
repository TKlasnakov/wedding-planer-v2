import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Guest } from '../models/guest.model';
import { DietaryRestriction } from '../models/dietary-restriction.model';
import { RsvpStatus } from '../models/rsvp-status.model';
import { DIETARY_OPTIONS, RSVP_OPTIONS } from './guest-form.constants';

@Component({
  selector: 'app-guest-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './guest-form.component.html',
  styleUrl: './guest-form.component.scss',
})
export class GuestFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<GuestFormComponent>);
  readonly guest = inject<Guest | null>(MAT_DIALOG_DATA);

  readonly isEdit = !!this.guest;
  readonly showPlusOneName = signal(this.guest?.plusOne ?? false);

  readonly rsvpOptions = RSVP_OPTIONS;
  readonly dietaryOptions = DIETARY_OPTIONS;

  readonly form = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.email]],
    phone: [''],
    rsvpStatus: [<RsvpStatus>'pending', Validators.required],
    dietaryRestriction: [<DietaryRestriction>'none', Validators.required],
    tableNumber: [<number | null>null, [Validators.min(1)]],
    allergies: [''],
    kidsUnder14: [0, [Validators.min(0)]],
    notes: [''],
    plusOne: [false],
    plusOneName: [''],
  });

  ngOnInit(): void {
    if (this.guest) {
      this.form.patchValue(this.guest);
    }

    this.form.controls.plusOne.valueChanges.subscribe(hasPlusOne => {
      this.showPlusOneName.set(!!hasPlusOne);
      if (!hasPlusOne) {
        this.form.controls.plusOneName.setValue('');
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { plusOne, plusOneName, tableNumber, kidsUnder14, ...rest } = this.form.getRawValue();
    const result: Omit<Guest, 'id'> = {
      firstName: rest.firstName ?? '',
      lastName: rest.lastName ?? '',
      email: rest.email ?? '',
      phone: rest.phone ?? '',
      rsvpStatus: rest.rsvpStatus ?? 'pending',
      dietaryRestriction: rest.dietaryRestriction ?? 'none',
      allergies: rest.allergies ?? '',
      kidsUnder14: Number(kidsUnder14) || 0,
      notes: rest.notes ?? '',
      plusOne: !!plusOne,
      plusOneName: plusOne && plusOneName ? plusOneName : undefined,
      tableNumber: tableNumber ? Number(tableNumber) : null,
    };

    this.dialogRef.close(result);
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
