import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from 'src/app/models/user.model';
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

  logOut() {
    localStorage.removeItem('diacta-user')
    localStorage.removeItem('diacta-token')
  }

  isLogged() : boolean {
    const user = localStorage.getItem('diacta-user')
    const token = localStorage.getItem('diacta-token')
    if (user && token) {
      return true
    }
    return false
  }

  isAdmin() : boolean {
    const userStr = localStorage.getItem('diacta-user')
    if (userStr) {
      const user = JSON.parse(userStr)
      if (user.isAdmin) {
        return true
      }
    }
    return false
  }

  getLoggedUser() {
    const userData = localStorage.getItem('diacta-user')
    if (userData) {
      return JSON.parse(userData)
    }
    return null
  }

  private setSession(response: LoginResponse) {
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
