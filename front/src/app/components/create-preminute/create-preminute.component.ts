import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';

import { User } from 'src/app/models/user.model';
import { Preminute, Annex, Topic } from 'src/app/models/preminute.model';
import { UsersService } from 'src/app/services/users/users.service';
import { MinutesService } from 'src/app/services/minutes/minutes.service';
import { Compromise } from '../../models/compromises.model';
import { orderCompromises, redirectToTask } from '../../helpers/index';

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

  previousCompromises: Compromise[] = []

  date: moment.Moment = moment()

  time: string = ''

  adviseParticipants: boolean = true

  isEdition = false

  errors = {
    description: false,
    place: false,
    date: false,
    time: false,
    notSavedTopic: false,
    notSavedAnnex: false
  }

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
    })

    this.minutesService.getPreviousCompromises().subscribe(response => {
      this.previousCompromises = orderCompromises(response);
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

  removeTopic(topicEnum: number) {
    this.preminute.topics = this.preminute.topics.filter(topic => topic.enum !== topicEnum)
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

  removeAnnex(name: string) {
    this.preminute.annexes = this.preminute.annexes.filter(annex => annex.name !== name)
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

  validatePreminute() {
    const errors = {
      description: false,
      place: false,
      date: false,
      time: false,
      notSavedTopic: false,
      notSavedAnnex: false
    }
    let errorDetected = false;
    if (!this.preminute.description) {
      errors.description = true;
      errorDetected = true;
    }
    if (!this.preminute.place) {
      errors.place = true;
      errorDetected = true;
    }
    if (!this.preminute.date) {
      errors.date = true;
      errorDetected = true;
    }
    if (!this.time) {
      errors.time = true;
      errorDetected = true;
    }
    if(this.newTopic.name || this.newTopic.description) {
      errors.notSavedTopic = true;
      errorDetected = true;
    }
    if(this.newAnnex.name || this.newAnnex.description || this.newAnnex.description) {
      errors.notSavedAnnex = true;
      errorDetected = true;
    }

    this.errors = errors;

    return !errorDetected;
  }

  goToTask(compromiseId: string) {
    redirectToTask(compromiseId)
  }

  createPreminute() {
    if (!this.validatePreminute()) {
      console.log("error")
      console.log(this.errors)
      return
    }
    const preminuteDate = this.date.toDate()
    this.preminute.date = preminuteDate;

    this.minutesService.createPreminute(this.preminute).subscribe(response => {
      this.router.navigate(['/actas'])
    },
    error => {
      console.error(error);
    })
  }
}
