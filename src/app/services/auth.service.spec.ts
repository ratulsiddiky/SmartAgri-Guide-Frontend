import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('stores session data from setSession', () => {
    service.setSession({ token: 'token-1', username: 'ratul', role: 'admin' });

    expect(localStorage.getItem('token')).toBe('token-1');
    expect(service.getToken()).toBe('token-1');
    expect(service.getUsername()).toBe('ratul');
    expect(service.getRole()).toBe('admin');
  });

  it('clears session data on clearSession', () => {
    service.setSession({ token: 'token-1', username: 'ratul', role: 'admin' });
    service.clearSession();

    expect(localStorage.getItem('token')).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });

  it('sends basic-auth login request', () => {
    service.login('ratul', 'Password1!').subscribe((response) => {
      expect(response.token).toBe('jwt-token');
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toContain('Basic');
    req.flush({ token: 'jwt-token', username: 'ratul' });
  });

  it('clears session when logout succeeds', () => {
    service.setSession({ token: 'token-1', username: 'ratul' });

    service.logout().subscribe();
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/logout`);
    expect(req.request.method).toBe('GET');
    req.flush({});

    expect(service.isAuthenticated()).toBe(false);
  });
});
