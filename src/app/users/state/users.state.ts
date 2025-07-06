import { User } from '../../shared/models/user.models';

export interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  selectedUser: User | null;
}

export const initialUsersState: UsersState = {
  users: [],
  loading: false,
  error: null,
  selectedUser: null,
};
