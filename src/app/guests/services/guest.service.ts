import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Guest } from '../models/guest.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GuestService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/guests`;
  private readonly _guests = signal<Guest[]>([]);
  readonly loading = signal(false);

  readonly guests = this._guests.asReadonly();

  constructor() {
    this.fetchGuests();
  }

  fetchGuests(): void {
    this.loading.set(true);
    this.http.get<Guest[]>(this.apiUrl).subscribe({
      next: (guests) => {
        this._guests.set(guests);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  addGuest(data: Omit<Guest, 'id'>): Observable<Guest> {
    return this.http.post<Guest>(this.apiUrl, data).pipe(
      tap((guest) => this._guests.update((guests) => [...guests, guest])),
    );
  }

  updateGuest(id: string, data: Omit<Guest, 'id'>): Observable<Guest> {
    return this.http.patch<Guest>(`${this.apiUrl}/${id}`, data).pipe(
      tap((updated) =>
        this._guests.update((guests) =>
          guests.map((guest) => (guest.id === id ? updated : guest)),
        ),
      ),
    );
  }

  deleteGuest(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this._guests.update((guests) => guests.filter((guest) => guest.id !== id))),
    );
  }
}
