import { Component, Inject, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as moment from 'moment';

import { Reminder, Vias } from 'src/app/models/reminder.model'
import { range, minutes, daysOfWeek } from 'src/app/helpers'
import { MatCheckboxChange } from '@angular/material/checkbox';

interface DialogData {
  reminder?: Reminder;
}

@Component({
  selector: 'reminder-dialog',
  templateUrl: 'index.html'
})
export class ReminderDialog  {

  eventTypes = ['Reunión', 'Tareas', 'Personalizado']

  reminder: Reminder = {
    event: "Reunión",
    when: {
      hour: 0
    },
    vias: []
  }

  reminderTypes = [
    {
      id: 1,
      name: "Semanal"
    },
    {
      id: 2,
      name: "Mensual",
    },
    {
      id: 3,
      name: "Fecha"
    }
  ]
  dayOfMonth = range(30, 1)
  dayOfWeek = daysOfWeek
  hours = range(21, 9)
  minutes = minutes

  reminderTypeSelected: number = 1
  selectedHour = 9
  selectedMinute = 0
  selectedDate: moment.Moment = moment()
  selectedDayOfMonth = 1
  selectedDayOfWeek = 0

  constructor(
    public dialogRef: MatDialogRef<ReminderDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    if (data.reminder) {
      this.reminder = data.reminder
    }
  }

  checkVia(via: Vias, event: MatCheckboxChange) {
    const {
      checked
    } = event

    if (checked) {
      this.reminder.vias.push(via)
    }
    else {
      this.reminder.vias = this.reminder.vias.filter(v => v != via)
    }
  }

  closeModal() {
    const reminder = this.reminder
    if(this.reminderTypeSelected == 1) {
      reminder.when.dayOfWeek = this.selectedDayOfWeek
    }
    else if (this.reminderTypeSelected == 2) {
      reminder.when.date = this.selectedDayOfMonth
    }
    else {
      reminder.when.year = this.selectedDate.get('year')
      reminder.when.month = this.selectedDate.get('month')
      reminder.when.date = this.selectedDate.get('date')
    }
    reminder.when.hour = this.selectedHour
    reminder.when.minute = this.selectedMinute
    this.dialogRef.close(reminder)
  }

}
