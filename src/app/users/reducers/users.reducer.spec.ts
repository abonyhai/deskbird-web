import { usersReducer } from './users.reducer';
import * as UsersActions from '../../store/users/users.actions';
import { initialUsersState } from '../../store/users/users.state';

const mockUser = { id: 1, email: 'a@b.com', fullName: 'Test User', role: 'Admin' };
const anotherUser = { id: 2, email: 'b@b.com', fullName: 'Another User', role: 'User' };

describe('usersReducer', () => {
  it('should set loading true and clear error on loadUsers', () => {
    const state = usersReducer(initialUsersState, UsersActions.loadUsers());
    expect(state.loading).toBeTrue();
    expect(state.error).toBeNull();
  });

  it('should set users and loading false on loadUsersSuccess', () => {
    const state = usersReducer(initialUsersState, UsersActions.loadUsersSuccess({ users: [mockUser] }));
    expect(state.users).toEqual([mockUser]);
    expect(state.loading).toBeFalse();
    expect(state.error).toBeNull();
  });

  it('should set error and loading false on loadUsersFailure', () => {
    const state = usersReducer(initialUsersState, UsersActions.loadUsersFailure({ error: 'fail' }));
    expect(state.loading).toBeFalse();
    expect(state.error).toBe('fail');
  });

  it('should set loading true and clear error on updateUser', () => {
    const state = usersReducer(initialUsersState, UsersActions.updateUser({ id: 1, dto: { email: 'a' } }));
    expect(state.loading).toBeTrue();
    expect(state.error).toBeNull();
  });

  it('should update user, set loading false, clear error, and clear selectedUser on updateUserSuccess', () => {
    const populatedState = { ...initialUsersState, users: [mockUser, anotherUser], selectedUser: mockUser };
    const updatedUser = { ...mockUser, email: 'updated@b.com' };
    const state = usersReducer(populatedState, UsersActions.updateUserSuccess({ user: updatedUser }));
    expect(state.users.length).toBeGreaterThan(0);
    expect(state.users[0]?.email).toBe('updated@b.com');
    expect(state.loading).toBeFalse();
    expect(state.error).toBeNull();
    expect(state.selectedUser).toBeNull();
  });

  it('should set error and loading false on updateUserFailure', () => {
    const state = usersReducer(initialUsersState, UsersActions.updateUserFailure({ error: 'fail' }));
    expect(state.loading).toBeFalse();
    expect(state.error).toBe('fail');
  });

  it('should clear error on clearUsersError', () => {
    const errorState = { ...initialUsersState, error: 'fail' };
    const state = usersReducer(errorState, UsersActions.clearUsersError());
    expect(state.error).toBeNull();
  });

  it('should set selectedUser on setSelectedUser', () => {
    const state = usersReducer(initialUsersState, UsersActions.setSelectedUser({ user: mockUser }));
    expect(state.selectedUser).toEqual(mockUser);
  });
});
