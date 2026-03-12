import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { budgetResolver } from './budget/budget.resolver';
import { guestsResolver } from './guests/guests.resolver';
import { tablesResolver } from './tables/tables.resolver';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'guests',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'guests',
    loadComponent: () =>
      import('./guests/guest.component').then(m => m.GuestComponent),
    resolve: { guests: guestsResolver },
    canActivate: [authGuard],
  },
  {
    path: 'tables',
    loadComponent: () =>
      import('./tables/tables.component').then(m => m.TablesComponent),
    resolve: { tables: tablesResolver, guests: guestsResolver },
    canActivate: [authGuard],
  },
  {
    path: 'budget',
    loadComponent: () =>
      import('./budget/budget.component').then(m => m.BudgetComponent),
    resolve: { budget: budgetResolver },
    canActivate: [authGuard],
  },
  {
    path: 'rsvp/:id',
    loadComponent: () =>
      import('./rsvp/rsvp-page.component').then(m => m.RsvpPageComponent),
    resolve: { guests: guestsResolver },
  },
  {
    path: '**',
    redirectTo: 'guests',
  },
];
