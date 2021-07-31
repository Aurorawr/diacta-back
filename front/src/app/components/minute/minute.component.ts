import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';

import { Minute } from 'src/app/models/minute/minute.model';
import { MinutesService } from 'src/app/services/minutes/minutes.service';

@Component({
  selector: 'app-minute',
  templateUrl: './minute.component.html',
  styleUrls: ['./minute.component.scss']
})
export class MinuteComponent implements OnChanges {

  @Input() minuteId: string = '';
  minute : Minute | null = null;
  loading : boolean = false;

  constructor(
    private minutesService: MinutesService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)
    const newMinuteId = changes.minuteId.currentValue;
    if (newMinuteId) {
      this.loading = true;
      this.minutesService.getMinute(newMinuteId).subscribe(data => {
        console.log(data);
  
        this.minute = data.minute;
      },
      error => {
        console.error(error);
      }, () => {
        this.loading = false;
      });
    }
  }

}
