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
          // Store authentication data if login was successful
          this.setAuthData(response.data);
        }
      }),
    );
  }

  public register(userData: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    // Set loading state to true when registration starts
    this.isLoadingSubject.next(true);

    return this.apiService.post<AuthResponse>('/auth/register', userData).pipe(
      tap((response: ApiResponse<AuthResponse>): void => {
        // Set loading state to false when registration completes
        this.isLoadingSubject.next(false);
        if (response.success && response.data) {
          // Store authentication data if registration was successful
          this.setAuthData(response.data);
        }
      }),
    );
  }

  public logout(): void {
    // SSR Check: Only access localStorage in browser environment
    // During server-side rendering, localStorage is not available
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
    // Reset user state to null
    this.currentUserSubject.next(null);
  }

  public getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  public isAuthenticated(): boolean {
    // SSR Check: Only access localStorage in browser environment
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return localStorage.getItem('auth_token') !== null;
    }
    return false;
  }

  public getToken(): string | null {
    // SSR Check: Only access localStorage in browser environment
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
          // Update authentication data with new tokens
          this.setAuthData(response.data);
        }
      }),
    );
  }

  private setAuthData(authData: AuthResponse): void {
    // SSR Check: Only access localStorage in browser environment
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      // Store JWT token for API authentication
      localStorage.setItem('auth_token', authData.token);
      // Store refresh token if provided (for token renewal)
      if (authData.refreshToken) {
        localStorage.setItem('refreshToken', authData.refreshToken);
      }
      // Store user data for quick access
      localStorage.setItem('user', JSON.stringify(authData.user));
    }
    // Update reactive state with new user data
    this.currentUserSubject.next(authData.user);
  }

  private getRefreshToken(): string | null {
    // SSR Check: Only access localStorage in browser environment
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return localStorage.getItem('refreshToken');
    }
    return null;
  }

  private loadUserFromStorage(): void {
    // SSR Check: Only access localStorage in browser environment
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const userStr: string | null = localStorage.getItem('user');
      if (userStr) {
        try {
          // Parse stored user data
          const user: User = JSON.parse(userStr);
          // Update reactive state with loaded user data
          this.currentUserSubject.next(user);
        } catch (error: unknown) {
          // If stored data is corrupted, clear it and log error
          console.error('Error parsing user from storage:', error);
          this.logout();
        }
      }
    }
  }
}
