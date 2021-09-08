import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';

interface UsersResponse {
  message: string;
  users: Array<User>;
}

interface UserResponse {
  message: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  usersUrl = environment.baseUrl + 'users/';

  constructor(private httpClient: HttpClient) { }

  getAllUsers(): Observable<UsersResponse> {
    const {
      usersUrl,
      httpClient
    } = this

    return httpClient.get<UsersResponse>(usersUrl);
  }

  createUser(userData: User) {
    const {
      usersUrl,
      httpClient
    } = this

    return httpClient.post<UserResponse>(usersUrl, userData)
  }

  editUser(userId: string, userData: any) {
    const {
      usersUrl,
      httpClient
    } = this
    const url = usersUrl + userId
    return httpClient.put<UserResponse>(url, userData)
  }
}
