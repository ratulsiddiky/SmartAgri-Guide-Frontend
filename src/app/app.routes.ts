import { Routes } from '@angular/router';
import { Home } from './home/home';
import { FarmsList } from './farms-list/farms-list';
import { FarmDetail } from './farm-detail/farm-detail';
import { Login } from './login/login';
import { Businesses } from './businesses/businesses';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'farms', component: FarmsList },
  { path: 'farms/:id', component: FarmDetail, canActivate: [authGuard] },
  { path: 'businesses', component: Businesses },
  { path: 'login', component: Login },
  { path: '**', redirectTo: '' },
];
