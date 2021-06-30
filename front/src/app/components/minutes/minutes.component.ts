import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { MinuteHeader } from 'src/app/models/minuteHeader/minute-header.model';
import { MinutesService } from 'src/app/services/minutes/minutes.service'

@Component({
  selector: 'app-minutes',
  templateUrl: './minutes.component.html',
  styleUrls: ['./minutes.component.scss']
})
export class MinutesComponent {

  minutes : Array<MinuteHeader> = [];

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

}
