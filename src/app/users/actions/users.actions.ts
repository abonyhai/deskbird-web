import { createAction, props } from '@ngrx/store';
import { User, UpdateUserDto } from '../../shared/models/user.models';

// Load Users
export const loadUsers = createAction('[Users] Load Users');
export const loadUsersSuccess = createAction('[Users] Load Users Success', props<{ users: User[] }>());
export const loadUsersFailure = createAction('[Users] Load Users Failure', props<{ error: string }>());

// Edit User
export const updateUser = createAction(
  '[Users] Update User',
  props<{ id: number; dto: UpdateUserDto }>()
);

export const updateUserSuccess = createAction(
  '[Users] Update User Success',
  props<{ user: User }>()
);

export const updateUserFailure = createAction(
  '[Users] Update User Failure',
  props<{ error: any }>()
);

// General
export const clearUsersError = createAction('[Users] Clear Error');
export const setSelectedUser = createAction('[Users] Set Selected User', props<{ user: User | null }>());
