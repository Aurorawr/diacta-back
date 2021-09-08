import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatListOption } from '@angular/material/list';

import { MinuteHeader } from 'src/app/models/minute-header.model';
import { MinutesService } from 'src/app/services/minutes/minutes.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-minutes',
  templateUrl: './minutes.component.html',
  styleUrls: ['./minutes.component.scss']
})
export class MinutesComponent {

  minutes : Array<MinuteHeader> = [];
  minuteSelectedId : string = '';
  isAdmin = false
  minuteAlreadyPrepared = false

  constructor(
    private minutesService : MinutesService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    if (authService.isAdmin()) {
      this.isAdmin = true
    }
  }

  ngOnInit() {
    console.log('init!')
    this.minutesService.getMinutes().subscribe(data => {

      this.minutes = data.minutes;

      this.minuteAlreadyPrepared = this.searchMinuteAlreadyPrepared(data.minutes)
    },
    error => {
      console.error(error);
    });

    this.route.queryParamMap.subscribe(params => {
      if(params) {
        const minuteId = params.get('id');
        if (minuteId) {
          this.minuteSelectedId = minuteId;
        }
      }
    })
  }

  onSelectedMinute(minuteOptions: MatListOption) {
    this.router.navigate(['/actas'], {
      queryParams: {id: minuteOptions.value},
      queryParamsHandling: 'merge'
    })
  }

  getMinuteIcon(phase: number): string {
    switch(phase) {
      case 1:
        return 'assignment'
      case 2:
        return 'pending_actions'
      default:
        return 'assignment_turned_in'
    }
  }

  getMinuteTitle(phase: number): string {
    switch(phase) {
      case 1:
        return 'Acta preparada'
      case 2:
        return 'Acta en desarrollo'
      default:
        return 'Acta desarrollada'
    }
  }

  searchMinuteAlreadyPrepared(minutes: MinuteHeader[]): boolean {
    const minutePrepared = this.minutes.find(minute => minute.phase == 1);
    if (minutePrepared) {
      return true
    }
    return false
  }

}
