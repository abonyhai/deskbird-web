import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/common.models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl: string = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  /**
   * GET request
   */
  public get<T>(endpoint: string, params?: HttpParams): Observable<ApiResponse<T>> {
    const url: string = `${this.baseUrl}${endpoint}`;
    const options = params ? { params } : {};
    return this.http.get<ApiResponse<T>>(url, options)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /**
   * POST request
   */
  public post<T>(endpoint: string, body: unknown): Observable<ApiResponse<T>> {
    const url: string = `${this.baseUrl}${endpoint}`;
    return this.http.post<ApiResponse<T>>(url, body)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * PUT request
   */
  public put<T>(endpoint: string, body: unknown): Observable<ApiResponse<T>> {
    const url: string = `${this.baseUrl}${endpoint}`;
    return this.http.put<ApiResponse<T>>(url, body)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * DELETE request
   */
  public delete<T>(endpoint: string): Observable<ApiResponse<T>> {
    const url: string = `${this.baseUrl}${endpoint}`;
    return this.http.delete<ApiResponse<T>>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * PATCH request
   */
  public patch<T>(endpoint: string, body: unknown): Observable<ApiResponse<T>> {
    const url: string = `${this.baseUrl}${endpoint}`;
    return this.http.patch<ApiResponse<T>>(url, body)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Handle HTTP errors
   */
  private readonly handleError = (error: unknown): Observable<never> => {
    let errorMessage: string = 'An error occurred';

    if (error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.message;
    } else if (error && typeof error === 'object' && 'status' in error) {
      // Server-side error
      const httpError = error as { status?: number; message?: string };
      errorMessage = httpError.status
        ? `Error Code: ${httpError.status}\nMessage: ${httpError.message ?? 'Unknown error'}`
        : 'Server error';
    }

    if (environment.enableDebug) {
      console.error('API Error:', error);
    }

    return throwError(() => new Error(errorMessage));
  };
}
