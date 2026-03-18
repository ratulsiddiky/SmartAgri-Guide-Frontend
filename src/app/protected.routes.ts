import { Routes } from '@angular/router';
import { authChildGuard, authMatchGuard } from './guards/auth.guard';

export const protectedRoutes: Routes = [
  {
    path: '',
    canMatch: [authMatchGuard],
    canActivateChild: [authChildGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/dashboard/home/home').then((m) => m.Home),
      },
      {
        path: 'farms',
        loadComponent: () =>
          import('./components/farms/farms-list/farms-list').then(
            (m) => m.FarmsList
          ),
      },
      {
        path: 'farms/:id',
        loadComponent: () =>
          import('./components/farms/farm-detail/farm-detail').then(
            (m) => m.FarmDetail
          ),
      },
      {
        path: 'businesses',
        loadComponent: () =>
          import('./components/dashboard/businesses/businesses').then(
            (m) => m.Businesses
          ),
      },
    ],
  },
];
