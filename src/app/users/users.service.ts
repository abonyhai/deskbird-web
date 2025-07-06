import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../shared/models/common.models';
import { User } from '../shared/models/user.models';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly baseUrl: string = '/api/users';

  public constructor(private http: HttpClient) {}

  public getUsers(): Observable<User[]> {
    return this.http.get<ApiResponse<User[]>>(this.baseUrl).pipe(
      map((res) => {
        if (!res.data) throw new Error('No users data');
        return res.data;
      }),
    );
  }

  public updateUser(user: User): Observable<User> {
    return this.http.patch<ApiResponse<User>>(`${this.baseUrl}/${user.id}`, user).pipe(
      map((res) => {
        if (!res.data) throw new Error('No user data');
        return res.data;
      }),
    );
  }
}
