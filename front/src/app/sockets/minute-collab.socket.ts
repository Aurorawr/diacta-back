import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class MinuteCollabSocket extends Socket {

  constructor(private auth: AuthService) {
    super({url: environment.socketUrl+'minute-collab',  options: {
      query: auth.getLoggedUser()
    }})
  }

  setQuery(): {
    [key: string]: string | null;
} {
    const user = this.auth.getLoggedUser()
    if (user) {
      return {
        userId: user._id,
        username: user._name
      }
    }
    return {}
  }
}