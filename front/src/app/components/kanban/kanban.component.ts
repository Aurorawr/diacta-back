import { Component, OnInit, EventEmitter } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';

import { TasksService } from 'src/app/services/tasks/tasks.service'
import { Task, GroupedTasks, TaskUser } from 'src/app/models/task.model'
import { TaskDialog } from 'src/app/dialogs/task/index.component'
@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss'],
})
export class KanbanComponent implements OnInit {

  tasks: GroupedTasks = {
    new: [],
    doing: [],
    paused: [],
    testing: [],
    ended: []
  }

  members: TaskUser[] = []

  newConnected = ['doingList']
  doingConnected = ['newList', 'pausedList', 'testingList', 'endedList']
  pausedConnected = ['doingList', 'endedList']
  testingConnected = ['endedList']
  endedConnected = []

  seeAllTasks = true

  assignUserEmmiter = new EventEmitter<{taskId: string, userId: string}>()
  assignDueDateEmmiter = new EventEmitter<{taskId: string, dueDate: Date}>()

  constructor(
    private tasksService: TasksService,
    private dialog: MatDialog
  ) {
    this.assignUserEmmiter.subscribe((response) => {
      const {
        taskId,
        userId
      } = response
      this.assignUserToTask(taskId, userId)
    })
    this.assignDueDateEmmiter.subscribe((response) => {
      const {
        taskId,
        dueDate
      } = response
      this.assignDueDateToTask(taskId, dueDate)
    })
  }

  ngOnInit() {
    this.tasksService.tasks.subscribe(response => {
      this.tasks = response
    })
    this.tasksService.members.subscribe(response => {
      this.members = response
    })
    this.tasksService.getTasks();
    this.tasksService.getMembers();
  }

  drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      if (event.previousContainer.id == "newList") {
        if (!event.previousContainer.data[event.previousIndex].user) {
          return
        }
      }
      transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
    }
  }

  getInitials(user: TaskUser | undefined) {
    if (user) {
      let initials: string = user.name[0]
      if(user.lastname) {
        initials += user.lastname[0]
      }
      return initials
    }
    return ""
  }

  openTask(task: Task) {
    this.dialog.open(TaskDialog, {
      width: '50vw',
      disableClose: true,
      data: {
        task,
        members: this.members,
        assignMember: this.assignUserEmmiter,
        assigDueDate: this.assignDueDateEmmiter
      }
    })
  }

  assignUserToTask(taskId: string, userId: string) {
    this.tasksService.assignUser(taskId, userId)
  }

  assignDueDateToTask(taskId: string, dueDate: Date) {
    this.tasksService.assignDueDate(taskId, dueDate)
  }
}
