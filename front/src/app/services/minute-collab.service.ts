import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Minute } from 'src/app/models/minute/minute.model';

interface BasicDataEdition {
  name: 'header' | 'description' | 'startTime' | 'endTime';
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class MinuteCollabService {

  minute = this.socket.fromEvent<Minute>('minute');
  editedData = this.socket.fromEvent<BasicDataEdition>('basicData');

  constructor(private socket: Socket) { }

  initMinute(minuteId: string) {
    this.socket.emit('initMinute', minuteId);
  }

  newDocument() {
    this.socket.emit('addDoc', { id: this.docId(), doc: '' });
  }

  editBasicData(name: string, value: any) {
    this.socket.emit('editBasicData', name, value);
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
