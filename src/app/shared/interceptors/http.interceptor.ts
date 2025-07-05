import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export function HttpRequestInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  // Get token from localStorage
  const token = localStorage.getItem('auth_token');

  // Clone the request and add headers
  let modifiedRequest = request.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  // Add authorization header if token exists
  if (token) {
    modifiedRequest = modifiedRequest.clone({
      setHeaders: {
        ...modifiedRequest.headers,
        'Authorization': `Bearer ${token}`
      }
    });
  }

  if (environment.enableDebug) {
    console.log('API Request:', {
      url: modifiedRequest.url,
      method: modifiedRequest.method,
      headers: modifiedRequest.headers
    });
  }

  return next(modifiedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (environment.enableDebug) {
        console.error('HTTP Error:', error);
      }

      // Handle 401 Unauthorized - redirect to login
      if (error.status === 401) {
        localStorage.removeItem('auth_token');
        // You can add navigation to login here if needed
        // this.router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
}
