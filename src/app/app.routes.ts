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
      import('./guests/guest-list/guest-list.component').then(m => m.GuestListComponent),
  },
  {
    path: 'tables',
    loadComponent: () =>
      import('./tables/seating-chart/seating-chart.component').then(m => m.SeatingChartComponent),
  },
  {
    path: 'budget',
    loadComponent: () =>
      import('./budget/budget-overview/budget-overview.component').then(m => m.BudgetOverviewComponent),
  },
  {
    path: 'rsvp/:id',
    loadComponent: () =>
      import('./guests/rsvp-page/rsvp-page.component').then(m => m.RsvpPageComponent),
  },
  {
    path: '**',
    redirectTo: 'guests',
  },
];
