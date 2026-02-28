import { DietaryRestriction } from '../models/dietary-restriction.model';
import { RsvpStatus } from '../models/rsvp-status.model';

export const RSVP_OPTIONS: { value: RsvpStatus; label: string }[] = [
  { value: RsvpStatus.Pending, label: 'Pending' },
  { value: RsvpStatus.Confirmed, label: 'Confirmed' },
  { value: RsvpStatus.Declined, label: 'Declined' },
];

export const DIETARY_OPTIONS: { value: DietaryRestriction; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'gluten-free', label: 'Gluten-free' },
  { value: 'halal', label: 'Halal' },
  { value: 'kosher', label: 'Kosher' },
  { value: 'other', label: 'Other' },
];
