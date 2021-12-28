import { Injectable } from '@angular/core';
import { MinuteCollabSocket } from 'src/app/sockets/minute-collab.socket'

import { AuthService } from '../auth/auth.service';
import { SimpleUser } from '../../models/user.model';

interface BasicDataEdition {
  name: 'header' | 'description' | 'startTime' | 'endTime';
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class MinuteCollabService {

  user!: SimpleUser

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
  dataSavedDate = this.socket.fromEvent<string>('dataSaved');
  participants = this.socket.fromEvent<SimpleUser[]>('participants');
  userAlreadyConnected = this.socket.fromEvent("userAlreadyConnected")
  minuteClosed = this.socket.fromEvent("minuteClosed")
  errorMessage = this.socket.fromEvent<any>('errorMessage');

  constructor(
    private socket: MinuteCollabSocket,
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

  editBasicData(name: string, value: any) {
    this.socket.emit('editBasicData', name, value);
  }

  switchEdition(attributeName: string, attributeId: null | string = null) {
    this.socket.emit('swithEdit', attributeName, this.user, attributeId);
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

  editTopic(topicId: string, topicData: any) {
    this.socket.emit('editTopic', topicId, topicData)
  }

  editAnnex(annexId: string, annexData: any) {
    this.socket.emit('editAnnex', annexId, annexData)
  }

  editDialogueElement(topicId: string, elementId: string, elementData: any) {
    this.socket.emit('editDialogueElement', topicId, elementId, elementData)
  }

  editNote(topicId: string, noteId: string, elementData: any) {
    this.socket.emit('editNote', topicId, noteId, elementData)
  }

  closeMinute() {
    this.socket.emit("closeMinute")
  }

  disconnect() {
    this.socket.disconnect()
  }
}
