import { DietaryRestriction } from './dietary-restriction.model';
import { RsvpStatus } from './rsvp-status.model';

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  rsvpStatus: RsvpStatus;
  dietaryRestriction: DietaryRestriction;
  allergies: string;
  kidsUnder14: number;
  tableNumber: number | null;
  notes: string;
  plusOne: boolean;
  plusOneName?: string;
}
