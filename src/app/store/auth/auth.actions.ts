import { createAction, props } from '@ngrx/store';
import { User } from '../../shared/models';
import { LoginRequest } from '../../auth/models/login-request.model';
import { RegisterRequest } from '../../auth/models/register-request.model';
import { AuthResponse } from '../../auth/models/auth.models';

export const login = createAction('[Auth] Login', props<{ credentials: LoginRequest }>());
export const loginSuccess = createAction('[Auth] Login Success', props<{ response: AuthResponse }>());
export const loginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());

export const register = createAction('[Auth] Register', props<{ userData: RegisterRequest }>());
export const registerSuccess = createAction('[Auth] Register Success', props<{ response: AuthResponse }>());
export const registerFailure = createAction('[Auth] Register Failure', props<{ error: string }>());

export const logout = createAction('[Auth] Logout');

export const loadUserFromStorage = createAction('[Auth] Load User From Storage');
export const loadUserFromStorageSuccess = createAction('[Auth] Load User From Storage Success', props<{ user: User | null }>());
export const loadUserFromStorageFailure = createAction('[Auth] Load User From Storage Failure', props<{ error: string }>());

export const refreshToken = createAction('[Auth] Refresh Token');
export const refreshTokenSuccess = createAction('[Auth] Refresh Token Success', props<{ response: AuthResponse }>());
export const refreshTokenFailure = createAction('[Auth] Refresh Token Failure', props<{ error: string }>());
