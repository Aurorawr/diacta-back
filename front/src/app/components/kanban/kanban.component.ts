import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

interface Task {
  compromise: string;
  user: string;
}
@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss'],
})
export class KanbanComponent {
  listIds = [
    'Get to work',
    'Pick up groceries',
    'Go home',
    'Fall asleep'
  ];

  seeAllTasks = true

  new: Task[] = [
    {
      compromise: "Hay que encontrar a alguien que nos ayude con la difusión por redes sociales",
      user: ""
    },
    {
      compromise: "Florecia va a experimentar con la plataforma del banco de tiempo para explicarnos su funcionamiento",
      user: "Florencia Campos"
    }
  ]
  doing: Task[] = [
    {
      compromise: "Se necesita diseñar el flyer de difusión antes de la próxima reunión",
      user: "Esteban Contreras"
    },
    {
      compromise: "Edmundo le explicará a los inasistentes lo tratado en la reunión",
      user: "Edmundo Leiva"
    }
  ]

  paused: Task[] = []

  testing: Task[] = [
    {
      compromise: "Alejandro hará una pequeña investigación sobre otros BdT en Santiago",
      user: "Alejandro Bloqueado"
    }
  ]

  ended: Task[] = [
    {
      compromise: "Edmundo invitará a Inés de CITIAPPS para que nos explique la instalación de un BdT.",
      user: "Edmundo Leiva"
    }
  ]

  drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
    }
  }

  getInitials(personName: string) {
    const wordsList = personName.split(' ')
    let initials: string = ""
    wordsList.forEach(word => {
      initials += word[0]
    })
    return initials
  }
}
