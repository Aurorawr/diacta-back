import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from 'src/app/models/user/user.model';
import { environment } from 'src/environments/environment';

interface UsersResponse {
  message: string;
  users: Array<User>;
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
}
