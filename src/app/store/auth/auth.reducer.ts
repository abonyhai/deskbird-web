import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { initialAuthState } from './auth.state';

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.login, AuthActions.register, AuthActions.refreshToken, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(
    AuthActions.loginSuccess,
    AuthActions.registerSuccess,
    AuthActions.refreshTokenSuccess,
    (state, { response }) => ({
      ...state,
      user: response.user,
      token: response.token,
      loading: false,
      error: null,
    }),
  ),
  on(
    AuthActions.loginFailure,
    AuthActions.registerFailure,
    AuthActions.refreshTokenFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      error,
    }),
  ),
  on(AuthActions.loadUserFromStorage, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.loadUserFromStorageSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null,
  })),
  on(AuthActions.loadUserFromStorageFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(AuthActions.logout, () => initialAuthState),
);
