import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import * as UsersActions from './users.actions';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class UsersEffects {
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUsers),
      mergeMap(() =>
        this.usersService.getUsers().pipe(
          map((users) => UsersActions.loadUsersSuccess({ users })),
          catchError((error) =>
            of(UsersActions.loadUsersFailure({ error: error.message || 'Failed to load users' })),
          ),
        ),
      ),
    ),
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.updateUser),
      mergeMap(({ id, dto }) =>
        this.usersService.updateUser(id, dto).pipe(
          map((updatedUser) => UsersActions.updateUserSuccess({ user: updatedUser })),
          catchError((error) =>
            of(UsersActions.updateUserFailure({ error: error.message || 'Failed to update user' })),
          ),
        ),
      ),
    ),
  );

  constructor(
    private actions$: Actions,
    private usersService: UsersService,
  ) {}
}
