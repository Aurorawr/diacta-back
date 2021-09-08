import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Minute } from 'src/app/models/minute.model';
import { MinutesService } from 'src/app/services/minutes/minutes.service';

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

@Component({
  selector: 'app-minute',
  templateUrl: './minute.component.html',
  styleUrls: ['./minute.component.scss']
})
export class MinuteComponent implements OnChanges {

  @Input() minuteId: string = '';
  @Input() isAdmin: boolean = false;
  minute : Minute | null = null;
  loading : boolean = false;

  constructor(
    private minutesService: MinutesService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    const newMinuteId = changes.minuteId.currentValue;
    if (newMinuteId) {
      this.loading = true;
      this.minutesService.getMinute(newMinuteId).subscribe(data => {
  
        this.minute = data.minute;
      },
      error => {
        this.snackBar.open('No existe un acta con ese Id', '', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: 'error-notification',
          duration: 5000
        })
        this.loading = false;
        this.router.navigate(['/actas'])
      }, () => {
        this.loading = false;
      });
    }
  }

  get getMinuteDatePlaceData() : string {
    if (this.minute) {
      const {
        minute
      } = this;
      this.minute.date = new Date(minute.date)
      const dateStr = `${minute.date.getDate()} de ${monthNames[minute.date.getMonth()]} del ${minute.date.getFullYear()}`
      const convokedTimeStr = `Convocada: ${minute.date.getHours()}:${minute.date.getMinutes()}`
      let startTimeStr = '';
      if (minute.startTime) {
        startTimeStr = ` Hora  de inicio: ${minute.startTime}`
      }
      let data = `${minute.place}, ${dateStr}. ${convokedTimeStr}.${startTimeStr}`;
      return data
    }
    return ''
  }

}
