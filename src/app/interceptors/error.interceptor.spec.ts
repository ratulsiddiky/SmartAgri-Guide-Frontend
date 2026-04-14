import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';

import { errorInterceptor } from './error.interceptor';
import { AuthService } from '../services/auth.service';

describe('errorInterceptor', () => {
  let authServiceSpy: { handleUnauthorized: ReturnType<typeof vi.fn> };
  let navigateSpy: (commands: readonly unknown[]) => Promise<boolean>;

  beforeEach(() => {
    authServiceSpy = {
      handleUnauthorized: vi.fn(),
    };
    navigateSpy = vi.fn(async () => true);

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });

    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockImplementation(navigateSpy as Router['navigate']);
  });

  it('handles 401 by delegating to auth service', () => {
    const http = TestBed.inject(HttpClient);
    const httpMock = TestBed.inject(HttpTestingController);

    http.get('/api/secure').subscribe({
      error: () => undefined,
    });

    const req = httpMock.expectOne('/api/secure');
    req.flush({ message: 'unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    const retryReq = httpMock.expectOne('/api/secure');
    retryReq.flush({ message: 'unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    expect(authServiceSpy.handleUnauthorized).toHaveBeenCalled();
  });

  it('redirects to home on 403', () => {
    const http = TestBed.inject(HttpClient);
    const httpMock = TestBed.inject(HttpTestingController);

    http.get('/api/forbidden').subscribe({
      error: () => undefined,
    });

    const req = httpMock.expectOne('/api/forbidden');
    req.flush({ message: 'forbidden' }, { status: 403, statusText: 'Forbidden' });

    const retryReq = httpMock.expectOne('/api/forbidden');
    retryReq.flush({ message: 'forbidden' }, { status: 403, statusText: 'Forbidden' });

    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });

  it('retries failed requests once before surfacing error', () => {
    const http = TestBed.inject(HttpClient);
    const httpMock = TestBed.inject(HttpTestingController);
    let failureCount = 0;

    http.get('/api/retry').subscribe({
      next: () => undefined,
      error: () => {
        failureCount += 1;
      },
    });

    const requests = httpMock.match('/api/retry');
    expect(requests.length).toBe(1);
    requests[0].flush({ message: 'error' }, { status: 500, statusText: 'Server Error' });

    const retryRequest = httpMock.expectOne('/api/retry');
    retryRequest.flush({ message: 'error' }, { status: 500, statusText: 'Server Error' });

    expect(failureCount).toBe(1);
  });
});
