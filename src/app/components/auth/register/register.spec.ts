import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { Register } from './register';
import { AuthService } from '../../../services/auth.service';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let authServiceSpy: {
    register: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    authServiceSpy = {
      register: vi.fn(() => of({ message: 'Registered' })),
    };

    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('rejects mismatched passwords', () => {
    component.registerForm.setValue({
      username: 'ratul',
      email: 'ratul@test.com',
      password: 'Password1!',
      confirmPassword: 'Password2!',
    });

    component.onRegister();

    expect(authServiceSpy.register).not.toHaveBeenCalled();
    expect(component.registerForm.errors?.['passwordMismatch']).toBe(true);
  });

  it('enforces password pattern validation', () => {
    component.registerForm.controls.password.setValue('password');
    expect(component.registerForm.controls.password.invalid).toBe(true);
    expect(component.passwordStrength).toBe('weak');
  });

  it('calculates password strength levels', () => {
    component.registerForm.controls.password.setValue('Password123');
    expect(component.passwordStrength).toBe('medium');

    component.registerForm.controls.password.setValue('Password1!');
    expect(component.passwordStrength).toBe('strong');
  });

  it('submits valid registration payload', () => {
    component.registerForm.setValue({
      username: 'ratul',
      email: 'ratul@test.com',
      password: 'Password1!',
      confirmPassword: 'Password1!',
    });

    component.onRegister();

    expect(authServiceSpy.register).toHaveBeenCalledWith({
      username: 'ratul',
      email: 'ratul@test.com',
      password: 'Password1!',
    });
  });

  it('shows API error on failed registration', () => {
    authServiceSpy.register.mockReturnValueOnce(
      throwError(() => ({ error: { message: 'Username taken' } }))
    );
    component.registerForm.setValue({
      username: 'ratul',
      email: 'ratul@test.com',
      password: 'Password1!',
      confirmPassword: 'Password1!',
    });

    component.onRegister();

    expect(component.errorMessage).toBe('Username taken');
  });
});
