import { Injectable } from '@angular/core';

import { TasksSocket } from 'src/app/sockets/tasks.socket'
import { Task, GroupedTasks, TaskUser } from 'src/app/models/task.model'

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  tasks = this.socket.fromEvent<GroupedTasks>('tasks')
  members = this.socket.fromEvent<TaskUser[]>('members')

  constructor(
    private socket: TasksSocket
  ) { }

  assignUser(taskId: string, userId: string) {
    this.socket.emit("assignUser", taskId, userId)
  }

  assignDueDate(taskId: string, dueDate: Date) {
    this.socket.emit("assignDueDate", taskId, dueDate)
  }
}