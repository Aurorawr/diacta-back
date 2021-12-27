import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';

import { User } from 'src/app/models/user.model';
import { UsersService } from 'src/app/services/users/users.service';
import { MinutesService } from 'src/app/services/minutes/minutes.service';
import { Compromise } from '../../models/compromises.model';
import { orderCompromises, minutes } from '../../helpers/index';
import { Minute, TopicType, AnnexType } from '../../models/minute.model';

@Component({
  selector: 'app-edit-minute',
  templateUrl: './edit-minute.component.html',
  styleUrls: ['./edit-minute.component.scss']
})
export class EditMinuteComponent implements OnInit {

  minute!: Minute

  newTopic: TopicType = {
    _id: "",
    enum: 1,
    name: '',
    description: '',
    dialogueElements: [],
    notes: []
  }

  newAnnex: AnnexType = {
    _id: "",
    url: '',
    name: '',
    description: ''
  }

  participants: Array<User> = []

  previousCompromises: Compromise[] = []

  date: moment.Moment = moment()

  time: string = ''

  adviseParticipants: boolean = true

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
        console.log(data.minute.date)
        this.minute = data.minute
        this.previousCompromises = data.minute.previousCompromises as Compromise[]
        const minuteDate = new Date(data.minute.date)
        this.date = moment(minuteDate)
        this.time = `${minuteDate.getHours()}:${minuteDate.getMinutes()}`
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
      this.usersService.getAllUsers().subscribe(response => {
        this.participants = response.users;
      },
      error => {
        console.error(error)
      })
    } else {
      this.router.navigate(['/actas'])
    }
  }

  addTopic() {
    const newTopic = this.newTopic;
    const topicEnum = this.minute.topics.length + 1;
    newTopic.enum = topicEnum;
    this.minute.topics.push(newTopic);
    this.newTopic = {
      _id: "",
      enum: 1,
      name: '',
      description: '',
      dialogueElements: [],
      notes: []
    }
  }

  removeTopic(topicEnum: number) {
    this.minute.topics = this.minute.topics.filter(topic => topic.enum !== topicEnum)
  }

  addAnnex() {
    const newAnnex = this.newAnnex;
    if (!newAnnex.description) {
      delete newAnnex.description;
    }
    this.minute.annexes.push(newAnnex);
    this.newAnnex = {
      _id: "",
      url: '',
      name: '',
      description: ''
    }
  }

  removeAnnex(name: string) {
    this.minute.annexes = this.minute.annexes.filter(annex => annex.name !== name)
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
    if (!this.minute.description) {
      errors.description = true;
      errorDetected = true;
    }
    if (!this.minute.place) {
      errors.place = true;
      errorDetected = true;
    }
    if (!this.minute.date) {
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

  createPreminute() {
    console.log("create")
    if (!this.validatePreminute()) {
      console.log("error")
      console.log(this.errors)
      return
    }
    const preminuteDate = this.date.toDate()
    this.minute.date = preminuteDate;

    this.minutesService.updateMinute(this.minute).subscribe(response => {
      console.log(response)
      this.router.navigate(['/actas'])
    },
    error => {
      console.error(error);
    })
  }
}
