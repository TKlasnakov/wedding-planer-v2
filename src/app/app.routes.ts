import { Routes } from '@angular/router';
import { guestsResolver } from './guests/guests.resolver';
import { tablesResolver } from './tables/tables.resolver';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'guests',
    pathMatch: 'full',
  },
  {
    path: 'guests',
    loadComponent: () =>
      import('./guests/guest.component').then(m => m.GuestComponent),
    resolve: { guests: guestsResolver },
  },
  {
    path: 'tables',
    loadComponent: () =>
      import('./tables/tables.component').then(m => m.TablesComponent),
    resolve: { tables: tablesResolver },
  },
  {
    path: 'budget',
    loadComponent: () =>
      import('./budget/budget.component').then(m => m.BudgetComponent),
  },
  {
    path: 'rsvp/:id',
    loadComponent: () =>
      import('./rsvp/rsvp-page.component').then(m => m.RsvpPageComponent),
  },
  {
    path: '**',
    redirectTo: 'guests',
  },
];
