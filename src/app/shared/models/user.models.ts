
export interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
}

export interface UpdateUserDto {
  email?: string;
  fullName?: string;
  role?: 'admin' | 'user';
}
