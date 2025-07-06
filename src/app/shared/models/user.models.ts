// User related interfaces
export interface User {
  readonly id: string;
  readonly email: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly avatar?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly role: string;
}
