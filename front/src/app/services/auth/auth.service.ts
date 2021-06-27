import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { User } from 'src/app/models/user/user.model';
import { baseUrl } from 'src/app/services/shared';
import { catchError } from 'rxjs/operators';

interface UserCredentials {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl = baseUrl + 'auth/'

  constructor(
    private http: HttpClient
  ) { }

  logIn(credentials: UserCredentials) : Observable<User> {
    const {
      authUrl,
      http
    } = this

    const url = authUrl + 'signin'

    return http.post<User>(url, credentials)
  }
}
