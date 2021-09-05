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

  minute = this.socket.fromEvent<any>('minute');
  editions = this.socket.fromEvent('editions')
  editedData = this.socket.fromEvent<BasicDataEdition>('basicData');
  topicEdited = this.socket.fromEvent<any>('topicEdited')
  annexEdited = this.socket.fromEvent<any>('annexEdited')
  dialogueElementEdited = this.socket.fromEvent<any>('dialogueElementEdited')
  noteEdited = this.socket.fromEvent<any>('noteEdited')
  newTopic = this.socket.fromEvent('newTopic')
  newAnnex = this.socket.fromEvent('newAnnex')
  newDialogueElement = this.socket.fromEvent<any>('newDialogueElement')
  newNote = this.socket.fromEvent<any>('newNote')
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

  addEdition(attribute: string, topicId = '') {
    this.socket.emit('addEdition', attribute, this.user, topicId)
  }

  removeEdition(attribute: string) {
    this.socket.emit('removeEdition', attribute, this.user)
  }

  getEditions() {
    this.socket.emit('getEditions')
  }

  addTopic(topic: any) {
    this.socket.emit('addTopic', topic)
  }

  addAnnex(annex: any) {
    this.socket.emit('addAnnex', annex)
  }

  addDialogueElement(topicId: string, element: any) {
    this.socket.emit('addDialogueElement', topicId, element)
  }

  addNote(topicId: string, note: any) {
    this.socket.emit('addNote', topicId, note)
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
