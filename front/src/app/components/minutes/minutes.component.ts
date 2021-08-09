import { Component } from '@angular/core';
import { MatListOption } from '@angular/material/list';

import { MinuteHeader } from 'src/app/models/minuteHeader/minute-header.model';
import { MinutesService } from 'src/app/services/minutes/minutes.service';

@Component({
  selector: 'app-minutes',
  templateUrl: './minutes.component.html',
  styleUrls: ['./minutes.component.scss']
})
export class MinutesComponent {

  minutes : Array<MinuteHeader> = [];
  minuteSelectedId : string = '';

  constructor(
    private minutesService : MinutesService
  ) {}

  ngOnInit() {
    this.minutesService.getMinutes().subscribe(data => {
      console.log(data);

      this.minutes = data.minutes;
    },
    error => {
      console.error(error);
    });
  }

  onSelectedMinute(minuteOptions: MatListOption) {
    console.log(minuteOptions.value)
    this.minuteSelectedId = minuteOptions.value;
  }

}
