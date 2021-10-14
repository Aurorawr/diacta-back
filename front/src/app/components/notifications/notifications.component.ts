import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Reminder, When, Vias } from 'src/app/models/reminder.model';
import { ReminderDialog } from 'src/app/dialogs/reminder/index.component'

const monthNames : {[key: number]: string}= {
  0: 'enero',
  1: 'febrero',
  2: 'marzo',
  3: 'abril',
  4: 'mayo',
  5: 'junio',
  6: 'julio',
  7: 'agosto',
  8: 'septiembre',
  9: 'octubre',
  10: 'noviembre',
  11: 'diciembre'
}

const dayNames : {[key: number]: string}= {
  0: 'domingo',
  1: 'lunes',
  2: 'martes',
  3: 'miércoles',
  4: 'jueves',
  5: 'viernes',
  6: 'sábado'
}

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {

  reminders: Reminder[] = []

  constructor(private dialog: MatDialog) { }

  openReminderDialog() {
    const dialogRef = this.dialog.open(ReminderDialog, {
      width: '50vw',
      data: {}
    })

    dialogRef.afterClosed().subscribe( (reminder: Reminder) => {
      if (reminder) {
        this.reminders.push(reminder)
      }
    })
  }

  getWhenString(when: When) {
    const {
      dayOfWeek,
      date,
      month,
      year,
      minute,
      hour
    } = when

    if (year && month && date && hour) {
      const formatedHour = `${this.formatDateElement(hour)}:${this.formatDateElement(minute)}`
      return `El ${date} de ${monthNames[month]} del ${year}  a las ${formatedHour}`
    }
    if (date && hour) {
      const formatedHour = `${this.formatDateElement(hour)}:${this.formatDateElement(minute)}`
      return `Los ${date} de cada mes a las ${formatedHour}`
    }
    if (dayOfWeek && hour) {
      const formatedHour = `${this.formatDateElement(hour)}:${this.formatDateElement(minute)}`
      return `Cada ${dayNames[dayOfWeek]} a las ${formatedHour}`
    }
    return "Horario inválido"
  }

  getMediaString(media: Vias[]) : string {
    if (media.length == 2) {
      return `${media[0]} y ${media[1]}`
    }
    return media[0]
  }

  formatDateElement(element: number | undefined) {
    if (element) {
      if (element < 10) {
        return `0${element}`
      }
      return element.toString()
    }
    return '00'
  }

}
