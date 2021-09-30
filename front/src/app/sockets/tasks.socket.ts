import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

@Injectable()
export class TasksSocket extends Socket {
  constructor() {
    super({url: environment.socketUrl+'tasks', options: {}})
  }
}