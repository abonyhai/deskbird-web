import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/common.models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl: string = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  public get<T>(endpoint: string, params?: HttpParams): Observable<ApiResponse<T>> {
    const url: string = `${this.baseUrl}${endpoint}`;
    const options = params ? { params } : {};
    return this.http.get<ApiResponse<T>>(url, options).pipe(retry(1), catchError(this.handleError));
  }

  public post<T>(endpoint: string, body: unknown): Observable<ApiResponse<T>> {
    const url: string = `${this.baseUrl}${endpoint}`;
    return this.http.post<ApiResponse<T>>(url, body).pipe(catchError(this.handleError));
  }

  public put<T>(endpoint: string, body: unknown): Observable<ApiResponse<T>> {
    const url: string = `${this.baseUrl}${endpoint}`;
    return this.http.put<ApiResponse<T>>(url, body).pipe(catchError(this.handleError));
  }

  public delete<T>(endpoint: string): Observable<ApiResponse<T>> {
    const url: string = `${this.baseUrl}${endpoint}`;
    return this.http.delete<ApiResponse<T>>(url).pipe(catchError(this.handleError));
  }

  public patch<T>(endpoint: string, body: unknown): Observable<ApiResponse<T>> {
    const url: string = `${this.baseUrl}${endpoint}`;
    return this.http.patch<ApiResponse<T>>(url, body).pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    return throwError(() => error);
  }
}
