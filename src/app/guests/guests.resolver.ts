import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';
import { Guest } from './models/guest.model';
import { GuestService } from './services/guest.service';

export const guestsResolver: ResolveFn<Guest[]> = () =>
  inject(GuestService).ensureGuests().pipe(catchError(() => of([])));
