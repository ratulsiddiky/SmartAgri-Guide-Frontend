import { Routes } from '@angular/router';
import { Home } from './home/home';
import { FarmsList } from './farms-list/farms-list';
import { FarmDetail } from './farm-detail/farm-detail';
import { Login } from './login/login';

export const routes: Routes = [
  { path: '', component: Home }, 
  { path: 'farms', component: FarmsList },
  { path: 'farms/:id', component: FarmDetail }, 
  { path: 'login', component: Login },
  { path: '**', redirectTo: '' } 
];