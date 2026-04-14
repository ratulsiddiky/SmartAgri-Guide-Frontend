import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, retry, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    retry({ count: 1 }),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.handleUnauthorized();
      } else if (error.status === 403) {
        void router.navigate(['/']);
      }

      return throwError(() => error);
    })
  );
};
