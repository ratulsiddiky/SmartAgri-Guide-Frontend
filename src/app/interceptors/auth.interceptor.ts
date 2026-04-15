import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const isAuthRequest =
    req.url.includes('/login') ||
    req.url.includes('/users/register') ||
    req.url.includes('/users/signup');

  if (isAuthRequest) {
    return next(req);
  }

  const token = localStorage.getItem('auth_token') || localStorage.getItem('token');

  if (!token) {
    return next(req);
  }

  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(clonedRequest);
};
