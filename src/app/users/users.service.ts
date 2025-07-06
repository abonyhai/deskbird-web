import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, throwError, tap, catchError } from 'rxjs';
import { ApiResponse } from '../shared/models/common.models';
import { User } from '../shared/models/user.models';
import { AuthService } from '../auth/services/auth.service';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly baseUrl: string = `${environment.apiBaseUrl}/users`;

  public constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  public getUsers(): Observable<User[]> {
    const token = this.authService.getToken();
    console.log('Token:', token);

    if (!token) {
      console.error('No authentication token available');
      return throwError(() => new Error('No authentication token'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    console.log('Request URL:', this.baseUrl);
    console.log('Request Headers:', headers);

    return this.http.get<any>(this.baseUrl, { headers }).pipe(
      tap(response => console.log('Response:', response)),
      map((res) => {
        if (Array.isArray(res)) {
          return res;
        }
        if (res && Array.isArray(res.data)) {
          return res.data;
        }
        throw new Error('No users data');
      }),
      catchError(error => {
        console.error('Error:', error);
        console.error('Error Status:', error.status);
        console.error('Error Headers:', error.headers);
        console.error('Error Body:', error.error);
        return throwError(() => error);
      })
    );
  }

  public updateUser(user: User): Observable<User> {
    const token = this.authService.getToken();

    if (!token) {
      return throwError(() => new Error('No authentication token'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.patch<ApiResponse<User>>(`${this.baseUrl}/${user.id}`, user, { headers }).pipe(
      map((res) => {
        if (!res.data) throw new Error('No user data');
        return res.data;
      }),
      catchError(error => {
        console.error('Update user error:', error);
        return throwError(() => error);
      })
    );
  }

  // Debug method from the guide
  public debugUsersRequest(): Observable<any> {
    const token = this.authService.getToken();

    const request = {
      url: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    console.log('Debug Request:', request);

    return this.http.get(request.url, { headers: new HttpHeaders(request.headers) })
      .pipe(
        tap(response => console.log('Debug Response:', response)),
        catchError(error => {
          console.log('Debug Error:', {
            status: error.status,
            statusText: error.statusText,
            url: error.url,
            headers: error.headers,
            body: error.error
          });
          return throwError(() => error);
        })
      );
  }
}
