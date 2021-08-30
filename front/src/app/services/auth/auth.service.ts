import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { User } from 'src/app/models/user/user.model';
import { environment } from 'src/environments/environment';
import { shareReplay, tap } from 'rxjs/operators';

interface UserCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  token?: string;
  user?: User
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl = environment.baseUrl + 'auth/'

  constructor(
    private http: HttpClient
  ) { }

  logIn(credentials: UserCredentials) : Observable<LoginResponse> {
    const {
      authUrl,
      http
    } = this

    const url = authUrl + 'signin'

    return http.post<LoginResponse>(url, credentials)
    .pipe(
      shareReplay(),
      tap(response => this.setSession(response))
    )
  }

  setSession(response: LoginResponse) {
    const {
      user,
      token
    } = response
    if (user && token) {
      localStorage.setItem('diacta-user', JSON.stringify(user))
      localStorage.setItem('diacta-token', token)
    }
  }
}
