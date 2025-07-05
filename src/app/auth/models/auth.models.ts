import { User } from '../../shared/models/user.models';

export interface AuthResponse {
  readonly user: User;
  readonly token: string;
  readonly refreshToken?: string;
}
