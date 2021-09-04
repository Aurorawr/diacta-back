import { Component, OnInit, OnDestroy, ElementRef, ViewChild, HostListener } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { MinuteCollabService } from 'src/app/services/minute-collab.service';
import { Minute } from 'src/app/models/minute/minute.model';

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

type Attribute = 'header' | 'description'

interface Edition {
  editing: boolean;
  edtitorId: string;
  editorName: string;
}

type Editions = {
  [key in Attribute]: Edition
}

@Component({
  selector: 'app-minute-collab',
  templateUrl: './minute-collab.component.html',
  styleUrls: ['./minute-collab.component.scss']
})
export class MinuteCollabComponent implements OnInit, OnDestroy {

  minuteId: string = '';
  minute: Minute | null= null;
  documents: Observable<string[]> = new Observable();
  currentDoc: string = '';

  localEditions = {
    header: false,
    description: false
  }

  externalEditions: Editions = {
    header: {
      editing: false,
      edtitorId: '',
      editorName: ''
    },
    description: {
      editing: false,
      edtitorId: '',
      editorName: ''
    }
  }

  private _docSub: Subscription = new Subscription();
  

  @ViewChild('headerInput') headerInput!:ElementRef;

  constructor(
    private collabService: MinuteCollabService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const minuteId = this.route.snapshot.paramMap.get('minuteId');
    if (minuteId) {
      console.log(this.minute)
      this.collabService.minute.subscribe(minute => this.minute = minute);
      this.collabService.editedData.subscribe(response => {
        console.log(response)
        if (this.minute) {
          this.minute[response.name] = response.value
        }
      })
      this.collabService.editions.subscribe(response => {
        const externalEditions = response as Editions
        this.externalEditions = externalEditions
      })
      this.collabService.switchedEdition.subscribe(response => {
        console.log(response)
        const attribute = response.attribute as Attribute
        const edition = response.value as Edition
        this.externalEditions[attribute] = edition
      })
      //this.collabService.getEditions()
      if (!this.minute) {
        this.collabService.initMinute(minuteId)
      }
      console.log(this.collabService.minute)
    }
    //his._docSub = this.collabService.currentDocument.subscribe(doc => this.currentDoc = doc.id);
  }

  /*@HostListener('window:unload', ['$event'])
  unloadHandler(event: any) {
      this.PostCall();
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event: any) {
      return false;
  }

  PostCall() {
    this.switchPendingEditions()
  }*/

  
  switchPendingEditions() {
    Object.entries(this.localEditions).forEach(([attribute, value]) => {
      console.log(attribute, value)
      if(value) {
        this.collabService.switchEdition(attribute)
      }
    })
  }

  ngOnDestroy() {
    //this._docSub.unsubscribe();
    alert('destroy')
  }

  editBasicData(name: string, event: KeyboardEvent) {
    const target = event.target as HTMLTextAreaElement;
    const value = target.value;

    this.collabService.editBasicData(name, value);
  }

  loadDoc(id: string) {
    //this.collabService.getDocument(id);
  }

  newDoc() {
    this.collabService.newDocument();
  }

  switchEdit(attribute: Attribute) {
    this.localEditions[attribute]= !this.localEditions[attribute]
    this.collabService.switchEdition(attribute)
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
