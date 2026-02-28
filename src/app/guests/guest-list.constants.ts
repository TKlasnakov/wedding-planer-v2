import { RsvpStatus } from './models/rsvp-status.model';

export const GUEST_DISPLAYED_COLUMNS = [
  'name',
  'email',
  'rsvpStatus',
  'plusOne',
  'dietaryRestriction',
  'allergies',
  'kidsUnder14',
  'tableNumber',
  'actions',
] as const;

export const GUEST_STATUS_OPTIONS: { value: RsvpStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'pending', label: 'Pending' },
  { value: 'declined', label: 'Declined' },
];
