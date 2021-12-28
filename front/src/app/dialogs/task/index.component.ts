import { Component, Inject, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as moment from 'moment';

import { Task, TaskUser } from 'src/app/models/task.model'

interface DialogData {
  task: Task;
  members: TaskUser[]
  assignMember: EventEmitter<{taskId: string, userId: string}>
  assigDueDate: EventEmitter<{taskId: string, dueDate: Date}>
}

@Component({
  selector: 'task-dialog',
  templateUrl: 'index.html'
})
export class TaskDialog  {

  statesName = {
    0: "Nuevo",
    1: "Desarrollándose",
    2: "Pausada",
    3: "Evaluando",
    4: "Finalizada"
  }

  task!: Task
  members!: TaskUser[]

  memberAssignedId: string = ''
  assignedDueDate: moment.Moment = moment()

  assigningUser = false
  assigningDueDate = false

  constructor(
    public dialogRef: MatDialogRef<TaskDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.task = data.task
    this.members = data.members
  }

  getUsername(user=this.task.user) {
    if (user) {
      let username = user.name
      if (user.lastname) {
        username += ` ${user.lastname}`
      }
      return username
    }
    return "No establecido"
  }

  assignUser() {
    this.data.assignMember.emit({taskId: this.task._id, userId: this.memberAssignedId})
    const assignedUser = this.members.find(member => member._id == this.memberAssignedId)
    this.task.user = assignedUser
    this.assigningUser = false
  }

  assignDueDate() {
    const assignedDueDate = this.assignedDueDate.toDate()
    this.data.assigDueDate.emit({taskId: this.task._id, dueDate: assignedDueDate})
    this.task.dueDate = assignedDueDate
    this.assigningDueDate = false
  }

}
