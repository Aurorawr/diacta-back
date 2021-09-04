import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

import { Minute } from 'src/app/models/minute/minute.model';
import { User } from '../models/user/user.model';
import { AuthService } from './auth/auth.service';

interface BasicDataEdition {
  name: 'header' | 'description' | 'startTime' | 'endTime';
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class MinuteCollabService {

  user!: {id: string, name: string}

  minute = this.socket.fromEvent<Minute>('minute');
  editions = this.socket.fromEvent('editions')
  editedData = this.socket.fromEvent<BasicDataEdition>('basicData');
  switchedEdition = this.socket.fromEvent<any>('edtionSwitched');
  errorMessage = this.socket.fromEvent<any>('errorMessage');

  constructor(
    private socket: Socket,
    private auth: AuthService
  ) {
    const loggedUser = auth.getLoggedUser()
    if (loggedUser) {
      this.user = {
        id: loggedUser._id,
        name: loggedUser.name
      }
    }
    else {
      this.user = {
        id: 'Invitado',
        name: 'Invitado'
      }
    }
  }

  initMinute(minuteId: string) {
    this.socket.emit('initMinute', minuteId);
  }

  newDocument() {
    this.socket.emit('addDoc', { id: this.docId(), doc: '' });
  }

  editBasicData(name: string, value: any) {
    this.socket.emit('editBasicData', name, value);
  }

  switchEdition(attributeName: string) {
    console.log(attributeName)
    console.log(this.user)
    this.socket.emit('swithEdit', attributeName, this.user);
    console.log('switched')
  }

  getEditions() {
    this.socket.emit('getEditions')
  }

  private docId() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }
}
