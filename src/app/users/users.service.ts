import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { environment } from '../environments/environment';
import { UpdateUserDto, User } from '../shared/models/user.models';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly baseUrl: string = `${environment.apiBaseUrl}/users`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  public getUsers(): Observable<User[]> {
    const token = this.authService.getToken();

    if (!token) {
      return throwError(() => new Error('No authentication token'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(this.baseUrl, { headers }).pipe(
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
        return throwError(() => error);
      })
    );
  }

  public updateUser(id: number, dto: UpdateUserDto): Observable<User> {
    const token = this.authService.getToken();

    if (!token) {
      return throwError(() => new Error('No authentication token'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.patch<User>(`${this.baseUrl}/${id}`, dto, { headers }).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }
}
