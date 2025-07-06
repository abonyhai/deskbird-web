import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../auth/services/auth.service';
import * as AuthActions from './auth.actions';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  public readonly login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          map((response) =>
            response.success && response.data
              ? AuthActions.loginSuccess({ response: response.data })
              : AuthActions.loginFailure({ error: response.message || 'Login failed' })
          ),
          catchError((error: unknown) =>
            of(AuthActions.loginFailure({ error: error instanceof Error ? error.message : 'Login error' }))
          )
        )
      )
    )
  );

  public readonly register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      mergeMap(({ userData }) =>
        this.authService.register(userData).pipe(
          map((response) =>
            response.success && response.data
              ? AuthActions.registerSuccess({ response: response.data })
              : AuthActions.registerFailure({ error: response.message || 'Registration failed' })
          ),
          catchError((error: unknown) =>
            of(AuthActions.registerFailure({ error: error instanceof Error ? error.message : 'Registration error' }))
          )
        )
      )
    )
  );

  public readonly loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => this.router.navigate(['/']))
      ),
    { dispatch: false }
  );

  public readonly registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(() => this.router.navigate(['/']))
      ),
    { dispatch: false }
  );

  public readonly logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => this.authService.logout())
      ),
    { dispatch: false }
  );

  public readonly loadUserFromStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadUserFromStorage),
      mergeMap(() =>
        this.authService.loadUserFromStorage().pipe(
          map((user) => AuthActions.loadUserFromStorageSuccess({ user })),
          catchError((error: unknown) =>
            of(AuthActions.loadUserFromStorageFailure({ error: error instanceof Error ? error.message : 'Failed to load user' }))
          )
        )
      )
    )
  );

  public readonly refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      mergeMap(() =>
        this.authService.refreshToken().pipe(
          map((response) =>
            response.success && response.data
              ? AuthActions.refreshTokenSuccess({ response: response.data })
              : AuthActions.refreshTokenFailure({ error: response.message || 'Token refresh failed' })
          ),
          catchError((error: unknown) =>
            of(AuthActions.refreshTokenFailure({ error: error instanceof Error ? error.message : 'Token refresh error' }))
          )
        )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}
}
