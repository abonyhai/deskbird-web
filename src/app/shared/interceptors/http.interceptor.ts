import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../../auth/services/auth.service';
import { environment } from '../../environments/environment';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(
    null,
  );

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token: string | null = this.authService.getToken();

    let setHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (token) {
      setHeaders['Authorization'] = `Bearer ${token}`;
    }
    const modifiedRequest = request.clone({ setHeaders });

    if (environment.enableDebug && typeof window !== 'undefined') {
      console.log('API Request:', {
        url: modifiedRequest.url,
        method: modifiedRequest.method,
        headers: modifiedRequest.headers,
      });
    }

    return next.handle(modifiedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (environment.enableDebug && typeof window !== 'undefined') {
          console.error('HTTP Error:', error);
        }
        // Only handle 401 if not already refreshing and not for refresh endpoint
        if (
          error.status === 401 &&
          !request.url.includes('/auth/refresh') &&
          typeof window !== 'undefined' &&
          typeof localStorage !== 'undefined'
        ) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      }),
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      return this.authService.refreshToken().pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.refreshTokenSubject.next(response.data.token);
          } else {
            this.authService.logout();
          }
        }),
        switchMap((response) => {
          if (response.success && response.data) {
            const newToken = response.data.token;
            const cloned = request.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` },
            });
            return next.handle(cloned);
          } else {
            this.authService.logout();
            return throwError(() => new Error('Refresh token failed'));
          }
        }),
        catchError((err) => {
          this.authService.logout();
          return throwError(() => err);
        }),
        tap(() => {
          this.isRefreshing = false;
        }),
      );
    } else {
      // Wait for refresh to complete, then retry
      return this.refreshTokenSubject.pipe(
        filter((token) => !!token),
        take(1),
        switchMap((token) => {
          const cloned = request.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
          });
          return next.handle(cloned);
        }),
      );
    }
  }
}
