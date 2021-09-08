import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';

import { User } from 'src/app/models/user.model';
import { Preminute, Annex, Topic } from 'src/app/models/preminute.model';
import { UsersService } from 'src/app/services/users/users.service';
import { MinutesService } from 'src/app/services/minutes/minutes.service';

@Component({
  selector: 'app-create-preminute',
  templateUrl: './create-preminute.component.html',
  styleUrls: ['./create-preminute.component.scss']
})
export class CreatePreminuteComponent implements OnInit {

  preminute: Preminute = {
    enum: 1,
    header: '',
    description: '',
    place: '',
    date: new Date(),
    topics: [{
      enum: 1,
      name: "Revisión de compromisos anteriores",
      description: ''
    }],
    annexes: []
  }

  newTopic: Topic = {
    enum: 1,
    name: '',
    description: ''
  }

  newAnnex: Annex = {
    url: '',
    name: '',
    description: ''
  }

  participants: Array<User> = []

  date: moment.Moment = moment()

  time: string = ''

  adviseParticipants: boolean = true

  isEdition = false

  constructor(
    private usersService: UsersService,
    private minutesService: MinutesService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {

    const minuteId = this.route.snapshot.paramMap.get('id');
    if (minuteId) {
      this.minutesService.getMinute(minuteId).subscribe(data => {
        this.isEdition = true
      },
      error => {
        this.snackBar.open('No existe un acta con ese Id', '', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: 'error-notification',
          duration: 5000
        })
        this.router.navigate(['/actas'])
      });
    }

    this.usersService.getAllUsers().subscribe(response => {
      this.participants = response.users;
    },
    error => {
      console.error(error)
    },
    () => {

    })
  }

  addTopic() {
    const newTopic = this.newTopic;
    const topicEnum = this.preminute.topics.length + 1;
    newTopic.enum = topicEnum;
    this.preminute.topics.push(newTopic);
    this.newTopic = {
      enum: topicEnum + 1,
      name: '',
      description: ''
    }
  }

  addAnnex() {
    const newAnnex = this.newAnnex;
    if (!newAnnex.description) {
      delete newAnnex.description;
    }
    this.preminute.annexes.push(newAnnex);
    this.newAnnex = {
      url: '',
      name: '',
      description: ''
    }
  }

  changeTime() {
    const timeArray = this.time.split(':');
    const hours = parseInt(timeArray[0], 10);
    const minutes = parseInt(timeArray[1], 10);
    const dateWithTime = this.date;
    dateWithTime.hour(hours);
    dateWithTime.minute(minutes);
    this.date = dateWithTime;
  }

  createPreminute() {
    const preminuteDate = this.date.toDate()
    this.preminute.date = preminuteDate;

    this.minutesService.createPreminute(this.preminute).subscribe(response => {
      this.router.navigate(['/actas'])
    },
    error => {
      console.error(error);
    },
    () => {

    })
  }
}
