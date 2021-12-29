import { Component, OnInit, EventEmitter } from '@angular/core';
import { CdkDragDrop, CdkDragEnter, CdkDragExit, CdkDragStart, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';

import { TasksService } from 'src/app/services/tasks/tasks.service'
import { Task, GroupedTasks, TaskUser } from 'src/app/models/task.model'
import { TaskDialog } from 'src/app/dialogs/task/index.component'
import { ActivatedRoute, Router } from '@angular/router';
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

  noBorderLists: string[] = []

  constructor(
    private tasksService: TasksService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
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
      const compromiseId = this.route.snapshot.queryParamMap.get("compromiseId")
      if (compromiseId) {
        const task = this.searchTask(compromiseId, response)
        if (task) {
          this.openTask(task)
          this.router.navigate([], {
            queryParams: {},
            replaceUrl: true,
            relativeTo: this.route
          });
        }
      }
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
      const updatedTask = event.container.data[event.currentIndex]
      const newState = this.getTaskStateRels(event.container.id)
      this.tasksService.updateTaskState(updatedTask._id, newState)
    }
    this.noBorderLists = []
  }

  startDrop(event: CdkDragStart<Task[]>) {
    console.log(event)
    const allClasses = ["newList", "doingList", "pausedList", "testingList", "endedList"]
    const connectedClasses = this.getConnectedList(event.source.dropContainer.id)
    const noBorderClasses = allClasses.filter(classType => !connectedClasses.includes(classType))
    if (this.noBorderLists !== noBorderClasses) {
      this.noBorderLists = noBorderClasses
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

  getCompromiseFullEnum(task: Task) {
    return `${task.compromise.references.minuteEnum}.${task.compromise.enum}`
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

  searchTask(compromiseId: string, tasks: GroupedTasks) {
    let taskFinded: Task | undefined = this.searchTaskInList(compromiseId, tasks.new)
    if (taskFinded) {
      return taskFinded
    }
    taskFinded = this.searchTaskInList(compromiseId, tasks.doing)
    if (taskFinded) {
      return taskFinded
    }
    taskFinded = this.searchTaskInList(compromiseId, tasks.paused)
    if (taskFinded) {
      return taskFinded
    }
    taskFinded = this.searchTaskInList(compromiseId, tasks.testing)
    if (taskFinded) {
      return taskFinded
    }
    taskFinded = this.searchTaskInList(compromiseId, tasks.ended)
    if (taskFinded) {
      return taskFinded
    }
    return taskFinded
  }

  searchTaskInList(compromiseId: string, tasks: Task[]) {
    return tasks.find(task => task.compromise._id === compromiseId)
  }

  checkNoBorder(classType: string) {
    return this.noBorderLists.includes(classType)
  }

  getConnectedList(listId: string) {
    switch(listId) {
      case "newList":
        return this.newConnected
      case "doingList":
        return this.doingConnected
      case "pausedList":
        return this.pausedConnected
      case "testingList":
        return this.testingConnected
      default:
        return []
    }
  }

  getTaskStateRels(listId: string) {
    switch(listId) {
      case "newList":
        return 0
      case "doingList":
        return 1
      case "pausedList":
        return 2
      case "testingList":
        return 3
      default:
        return 4
    }
  }
}
