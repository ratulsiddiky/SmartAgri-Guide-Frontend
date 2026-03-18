import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private api: ApiService) {}

  login(username: string, password: string) {
    return this.api.login(username, password);
  }

  logout() {
    return this.api.logout();
  }

  isLoggedIn() {
    return this.api.isLoggedIn();
  }
}

