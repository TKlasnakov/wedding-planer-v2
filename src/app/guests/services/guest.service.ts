import { Injectable, inject, signal } from '@angular/core';
import { Guest } from '../models/guest.model';
import { StorageService } from '../../shared/services/storage.service';

@Injectable({ providedIn: 'root' })
export class GuestService {
  private readonly STORAGE_KEY = 'wedding_guests';
  private readonly storageService = inject(StorageService);
  private readonly _guests = signal<Guest[]>(this.loadGuests());

  readonly guests = this._guests.asReadonly();

  addGuest(guest: Omit<Guest, 'id'>): void {
    const newGuest: Guest = { ...guest, id: crypto.randomUUID() };
    this._guests.update(guests => [...guests, newGuest]);
    this.persist();
  }

  updateGuest(id: string, updates: Omit<Guest, 'id'>): void {
    this._guests.update(guests =>
      guests.map(guest => (guest.id === id ? { ...updates, id } : guest)),
    );
    this.persist();
  }

  deleteGuest(id: string): void {
    this._guests.update(guests => guests.filter(guest => guest.id !== id));
    this.persist();
  }

  private loadGuests(): Guest[] {
    return this.storageService.get<Guest[]>(this.STORAGE_KEY) ?? this.sampleGuests();
  }

  private persist(): void {
    this.storageService.set(this.STORAGE_KEY, this._guests());
  }

  private sampleGuests(): Guest[] {
    return [
      {
        id: crypto.randomUUID(),
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice@example.com',
        phone: '+1 555-0101',
        rsvpStatus: 'confirmed',
        plusOne: true,
        plusOneName: 'James Johnson',
        dietaryRestriction: 'none',
        allergies: '',
        kidsUnder14: 0,
        tableNumber: null,
        notes: '',
      },
      {
        id: crypto.randomUUID(),
        firstName: 'Carol',
        lastName: 'Smith',
        email: 'carol@example.com',
        phone: '',
        rsvpStatus: 'pending',
        plusOne: false,
        dietaryRestriction: 'vegetarian',
        allergies: 'nuts',
        kidsUnder14: 2,
        tableNumber: null,
        notes: '',
      },
      {
        id: crypto.randomUUID(),
        firstName: 'David',
        lastName: 'Brown',
        email: 'david@example.com',
        phone: '',
        rsvpStatus: 'declined',
        plusOne: false,
        dietaryRestriction: 'gluten-free',
        allergies: '',
        kidsUnder14: 0,
        tableNumber: null,
        notes: 'Unable to attend due to travel',
      },
    ];
  }
}
