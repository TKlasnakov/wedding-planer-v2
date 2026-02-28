import { Routes } from '@angular/router';

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
  },
  {
    path: 'tables',
    loadComponent: () =>
      import('./tables/tables.component').then(m => m.TablesComponent),
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
