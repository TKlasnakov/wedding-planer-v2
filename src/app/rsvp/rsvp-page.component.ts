import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { GuestService } from '../guests/services/guest.service';
import { Guest } from '../guests/models/guest.model';
import { DietaryRestriction } from '../guests/models/dietary-restriction.model';
import { RsvpStatus } from '../guests/models/rsvp-status.model';
import { DIETARY_OPTIONS, RSVP_OPTIONS } from '../guests/guest-form/guest-form.constants';

@Component({
  selector: 'app-rsvp-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './rsvp-page.component.html',
  styleUrl: './rsvp-page.component.scss',
})
export class RsvpPageComponent implements OnInit {
  private readonly guestService = inject(GuestService);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  private readonly guestId = this.route.snapshot.paramMap.get('id') ?? '';

  protected readonly guest = computed(() =>
    this.guestService.guests().find(guest => guest.id === this.guestId) ?? null,
  );

  protected readonly submitted = signal(false);
  protected readonly showPlusOneName = signal(false);

  protected readonly rsvpOptions = RSVP_OPTIONS;
  protected readonly dietaryOptions = DIETARY_OPTIONS;

  protected readonly form = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.email]],
    phone: [''],
    rsvpStatus: [<RsvpStatus>'pending', Validators.required],
    dietaryRestriction: [<DietaryRestriction>'none', Validators.required],
    allergies: [''],
    kidsUnder14: [0, [Validators.min(0)]],
    notes: [''],
    plusOne: [false],
    plusOneName: [''],
  });

  ngOnInit(): void {
    const guest = this.guest();
    if (guest) {
      this.form.patchValue(guest);
      this.showPlusOneName.set(guest.plusOne);
    }

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

    const guest = this.guest();
    if (!guest) return;

    const { plusOne, plusOneName, kidsUnder14, ...rest } = this.form.getRawValue();
    const updated: Omit<Guest, 'id'> = {
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
      tableNumber: guest.tableNumber,
    };

    this.guestService.updateGuest(this.guestId, updated);
    this.submitted.set(true);
  }
}
