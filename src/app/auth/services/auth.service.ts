import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from '../../shared/services/api.service';
import { User } from '../../shared/models';
import { LoginRequest } from '../models/login-request.model';
import { RegisterRequest } from '../models/register-request.model';
import { AuthResponse } from '../models/auth.models';
import { ApiResponse } from '../../shared/models/common.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  public readonly currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(private readonly apiService: ApiService) {
    this.loadUserFromStorage();
  }

  public login(credentials: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.apiService.post<AuthResponse>('/auth/login', credentials).pipe(
      tap((response: ApiResponse<AuthResponse>): void => {
        if (response.success && response.data) {
          this.setAuthData(response.data);
        }
      }),
    );
  }

  public register(userData: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.apiService.post<AuthResponse>('/auth/register', userData).pipe(
      tap((response: ApiResponse<AuthResponse>): void => {
        if (response.success && response.data) {
          this.setAuthData(response.data);
        }
      }),
    );
  }

  public logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  public getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  public isAuthenticated(): boolean {
    return localStorage.getItem('auth_token') !== null;
  }

  public getToken(): string | null {
    return localStorage.getItem('auth_token');
  }


  public refreshToken(): Observable<ApiResponse<AuthResponse>> {
    const refreshToken: string | null = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    return this.apiService.post<AuthResponse>('/auth/refresh', { refreshToken }).pipe(
      tap((response: ApiResponse<AuthResponse>): void => {
        if (response.success && response.data) {
          this.setAuthData(response.data);
        }
      }),
    );
  }

  private setAuthData(authData: AuthResponse): void {
    localStorage.setItem('auth_token', authData.token);
    if (authData.refreshToken) {
      localStorage.setItem('refresh_token', authData.refreshToken);
    }
    localStorage.setItem('user', JSON.stringify(authData.user));
    this.currentUserSubject.next(authData.user);
  }

  /**
   * Load user from localStorage on app start
   */
  private loadUserFromStorage(): void {
    const userStr: string | null = localStorage.getItem('user');
    if (userStr) {
      try {
        const user: User = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (error: unknown) {
        console.error('Error parsing user from storage:', error);
        this.logout();
      }
    }
  }
}
