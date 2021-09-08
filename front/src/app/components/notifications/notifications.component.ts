import { Component } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {

  reminders = [
    {
      event: "Reunión",
      type: 2,
      when: "30 minutos antes de cada reunión",
      vias: ["Email", "SMS"]
    },
    {
      event: "Tareas",
      type: 2,
      when: "Los viernes a las 19:00 horas",
      vias: ["Email", "SMS"]
    },
    {
      event: "Tareas",
      type: 1,
      when: "Domingo 12 de septiembre a las 12:00",
      vias: ["Email"]
    },
    {
      event: "Personalizado",
      type: 1,
      when: "30 minutos antes de cada reunión",
      vias: ["SMS"],
      message: "Preguntarle al Javier sobre la difusión en redes sociales"
    },
    {
      event: "Personalizado",
      type: 2,
      when: "Todos los martes a las 21:00",
      vias: ["Email"],
      message: "Revisar los interaciones en la página"
    }
  ]

  getMediaString(media: string[]) : string {
    if (media.length == 2) {
      return `${media[0]} y ${media[1]}`
    }
    return media[0]
  }

}
