import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
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
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  private readonly isLoadingSubject = new BehaviorSubject<boolean>(false);

  public readonly currentUser$ = this.currentUserSubject.asObservable();
  public readonly isLoading$ = this.isLoadingSubject.asObservable();

  constructor(private readonly apiService: ApiService) {
    this.loadUserFromStorage();
  }

  public login(credentials: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    this.isLoadingSubject.next(true);
    return this.apiService.post<AuthResponse>('/auth/login', credentials).pipe(
      tap((response: ApiResponse<AuthResponse>): void => {
        this.isLoadingSubject.next(false);
        if (response.success && response.data) {
          this.setAuthData(response.data);
        }
      })
    );
  }

  public register(userData: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    this.isLoadingSubject.next(true);
    return this.apiService.post<AuthResponse>('/auth/register', userData).pipe(
      tap((response: ApiResponse<AuthResponse>): void => {
        this.isLoadingSubject.next(false);
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
    this.currentUserSubject.next(null);
  }

  public getCurrentUser(): User | null {
    return this.currentUserSubject.value;
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

  private setAuthData(authData: AuthResponse): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('auth_token', authData.token);
      if (authData.refreshToken) {
        localStorage.setItem('refreshToken', authData.refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(authData.user));
    }
    this.currentUserSubject.next(authData.user);
  }

  private getRefreshToken(): string | null {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return localStorage.getItem('refreshToken');
    }
    return null;
  }

  private loadUserFromStorage(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
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
}
