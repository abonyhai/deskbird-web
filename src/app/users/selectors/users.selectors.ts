import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UsersState } from '../state/users.state';

export const selectUsersState = createFeatureSelector<UsersState>('users');

export const selectUsers = createSelector(selectUsersState, (state) => state.users);
export const selectUsersLoading = createSelector(selectUsersState, (state) => state.loading);
export const selectUsersError = createSelector(selectUsersState, (state) => state.error);
export const selectSelectedUser = createSelector(selectUsersState, (state) => state.selectedUser);
