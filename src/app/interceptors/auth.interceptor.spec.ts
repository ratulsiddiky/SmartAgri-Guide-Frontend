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
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';
import { vi } from 'vitest';

describe('authInterceptor', () => {
  let getTokenSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    getTokenSpy = vi.fn(() => 'test-token-123');
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        {
          provide: AuthService,
          useValue: { getToken: getTokenSpy },
        },
      ],
    });
  });

  it('should attach Bearer token to outgoing requests', () => {
    const http = TestBed.inject(HttpClient);
    const httpMock = TestBed.inject(HttpTestingController);

    http.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token-123');
    req.flush({});
    httpMock.verify();
  });

  it('should not attach Authorization header when token is empty', () => {
    getTokenSpy.mockReturnValueOnce('');

    const http = TestBed.inject(HttpClient);
    const httpMock = TestBed.inject(HttpTestingController);

    http.get('/api/no-token').subscribe();

    const req = httpMock.expectOne('/api/no-token');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
    httpMock.verify();
  });
});
