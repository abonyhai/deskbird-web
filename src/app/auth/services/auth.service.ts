import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { User } from '../../shared/models';
import { ApiResponse } from '../../shared/models/common.models';
import { ApiService } from '../../shared/services/api.service';
import { AuthResponse } from '../models/auth.models';
import { LoginRequest } from '../models/login-request.model';
import { RegisterRequest } from '../models/register-request.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly apiService: ApiService) {}

  public login(credentials: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.apiService.post<AuthResponse>('/auth/login', credentials).pipe(
      tap((response: ApiResponse<AuthResponse>): void => {
        if (response.success && response.data) {
          this.setAuthData(response.data);
        }
      })
    );
  }

  public register(userData: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.apiService.post<AuthResponse>('/auth/register', userData).pipe(
      tap((response: ApiResponse<AuthResponse>): void => {
        if (response.success && response.data) {
          this.setAuthData(response.data);
        }
      })
    );
  }

  public logout(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  public getCurrentUser(): User | null {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const userStr: string | null = localStorage.getItem('user');
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch (error: unknown) {
          console.error('Error parsing user from storage:', error);
          this.logout();
          return null;
        }
      }
    }
    return null;
  }

  public isAuthenticated(): boolean {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return localStorage.getItem('auth_token') !== null;
    }
    return false;
  }

  public getToken(): string | null {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  public refreshToken(): Observable<ApiResponse<AuthResponse>> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    return this.apiService.post<AuthResponse>('/auth/refresh', { refreshToken }).pipe(
      tap((response: ApiResponse<AuthResponse>): void => {
        if (response.success && response.data) {
          this.setAuthData(response.data);
        }
      })
    );
  }

  public loadUserFromStorage(): Observable<User | null> {
    const user = this.getCurrentUser();
    return of(user);
  }

  private setAuthData(authData: AuthResponse): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('auth_token', authData.token);
      if (authData.refreshToken) {
        localStorage.setItem('refreshToken', authData.refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(authData.user));
    }
  }

  private getRefreshToken(): string | null {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return localStorage.getItem('refreshToken');
    }
    return null;
  }
}
