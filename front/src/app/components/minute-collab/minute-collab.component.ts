import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
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
          this.headerInput.nativeElement.value = response.value
        }
      })
      if (!this.minute) {
        this.collabService.initMinute(minuteId)
      }
      console.log(this.collabService.minute)
    }
    //his._docSub = this.collabService.currentDocument.subscribe(doc => this.currentDoc = doc.id);
  }

  ngOnDestroy() {
    this._docSub.unsubscribe();
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
