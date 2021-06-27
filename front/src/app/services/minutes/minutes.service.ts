import { Injectable } from '@angular/core';
import { MinuteHeader } from 'src/app/models/minuteHeader/minute-header.model';
import { Minute } from 'src/app/models/minute/minute.model';

@Injectable({
  providedIn: 'root'
})
export class MinutesService {

  constructor() { }

  getMinutes() : Array<MinuteHeader> {
    const minuteHeadersList : Array<MinuteHeader> = [];

    for(let i = 1; i < 15; i++) {
      minuteHeadersList.push({
        _id: "fgjfjgfkgnfdnd",
        date: new Date(),
        enum: i
      })
    }

    return minuteHeadersList;
  }

  getMinute() : Minute {
    return {
      _id: 'gjgfkjgkfjfg',
      enum: 7,
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      place: 'San Miguel',
      date: new Date(2021,3,15,19),
      startTime: '19:14',
      endTime: '20:37',
      nextReunionDate: new Date(2021,3,22,19),
      previousCompromises: [{
        minuteEnum: 5,
        enum: 2,
        content: 'Paola promete juntar firmas para aprobar el proyecto.',
        minuteId: 'jfigjfkgjfigfigh'
      },{
        minuteEnum: 6,
        enum: 1,
        content: 'Paola promete juntar firmas para aprobar el proyecto.',
        minuteId: 'jfigjfkgjfigfigh'
      },
      {
        minuteEnum: 6,
        enum: 4,
        content: 'Paola promete juntar firmas para aprobar el proyecto.',
        minuteId: 'jfigjfkgjfigfigh'
      }],
      topics: [{
        enum: 1,
        title: 'Resumen de logros',
        description: 'Se presenta sobre los objetivos propuestos al principio del proyecto y su avance',
        elements: [{
            type: 'Duda',
            enum: 1,
            content: 'Alberto no recuerda si se iba a dar un plazo extra para los logros no cumplidos',
        },
        {
          type: 'Nota',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        },{
          type: 'Acuerdo',
          enum: 2,
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        }]
      },
      {
        enum: 2,
        title: 'Nueva planificación',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        elements: [{
            type: 'Nota',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        },
        {
          type: 'Nota',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        },{
          type: 'Compromiso',
          enum: 3,
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        }]
      },
      {
        enum: 3,
        title: 'Asignación de roles',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        elements: [{
            type: 'Compromiso',
            enum: 4,
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        },
        {
          type: 'Compromiso',
          enum: 5,
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        },{
          type: 'Nota',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        }]
      }],
      annexes: [{
          url: 'https://www.youtube.com/watch?v=d_HlPboLRL8'
      }]
    }
  }
}
