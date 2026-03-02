import { Guest } from '../../guests/models/guest.model';

export interface Table {
  id: string;
  name: string;
  number: number;
  capacity: number;
  guest?: Guest[];
}
