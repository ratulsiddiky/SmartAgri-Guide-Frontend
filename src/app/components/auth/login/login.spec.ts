import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';

import { Login } from './login';

@Component({
  standalone: true,
  template: '<div>Farms</div>',
})
class DummyFarmsComponent {}

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authServiceSpy: {
    isAuthenticated: ReturnType<typeof vi.fn>;
    login: ReturnType<typeof vi.fn>;
  };
  let notificationServiceSpy: {
    showError: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    authServiceSpy = {
      isAuthenticated: vi.fn(() => false),
      login: vi.fn(() => of({ token: 't', username: 'u' })),
    };
    notificationServiceSpy = {
      showError: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideRouter([{ path: 'farms', component: DummyFarmsComponent }]),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows validation error for empty credentials', () => {
    component.onLogin();

    expect(component.errorMessage).toContain('Please enter both username and password.');
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('calls login when form is valid', () => {
    component.loginForm.setValue({ username: '  ratul ', password: '  pass ' });
    component.onLogin();

    expect(authServiceSpy.login).toHaveBeenCalledWith('ratul', 'pass');
  });

  it('shows authentication error message', () => {
    authServiceSpy.login.mockReturnValueOnce(
      throwError(() => ({ error: { message: 'Invalid credentials' } }))
    );
    component.loginForm.setValue({ username: 'ratul', password: 'bad' });
    component.onLogin();

    expect(component.errorMessage).toBe('Invalid credentials');
    expect(notificationServiceSpy.showError).toHaveBeenCalledWith('Invalid credentials');
  });
});
