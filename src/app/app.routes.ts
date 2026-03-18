import { Routes } from '@angular/router';
import { Home } from './components/dashboard/home/home';
import { FarmsList } from './components/farms/farms-list/farms-list';
import { FarmDetail } from './components/farms/farm-detail/farm-detail';
import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';
import { Businesses } from './components/dashboard/businesses/businesses';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'farms', component: FarmsList },
  { path: 'farms/:id', component: FarmDetail, canActivate: [authGuard] },
  { path: 'businesses', component: Businesses },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: '**', redirectTo: '' },
];
