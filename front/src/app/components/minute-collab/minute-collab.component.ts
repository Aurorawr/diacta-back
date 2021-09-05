import { Component, OnInit, OnDestroy, ElementRef, ViewChild, HostListener } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { MinuteCollabService } from 'src/app/services/minute-collab.service';
import { Minute, TopicType, annexType, NoteType, DialogueElementType } from 'src/app/models/minute/minute.model';

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

type Attribute = 'header' | 'description' | 'addingTopic' | 'addingAnnexes' | 'addingNotes' | 'addingDialogueElements'

interface Edition {
  editing: boolean;
  edtitorId: string;
  editorName: string;
  topicId?: string;
}

interface Editions {
  header: Edition;
  description: Edition;
  topics: {
    [key: string] : {
      name: Edition;
      description: Edition;
      notes: {
        [key: string] : Edition
      },
      dialogueElements: {
        [key: string] : Edition
      }
    }
  };
  annexes: {
    [key: string]: Edition
  };
  addingTopic: Edition[];
  addingAnnexes: Edition[];
  addingNotes: Edition[];
  addingDialogueElements: Edition[];
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

  newTopic: {name: string, description: string} = {
    name: '',
    description: ''
  }

  newNote: {content: string } = {
    content: ''
  }

  newDialogueElement: {elementType: string, content: string} = {
    elementType: 'Acuerdo',
    content: ''
  }

  newAnnex: {url: string, name: string, description: string} = {
    url: '',
    name: '',
    description: ''
  }

  dialogueElementTypes  = ['Acuerdo', 'Compromiso', 'Duda', 'Desacuerdo']

  localEditions = {
    header: false,
    description: false,
    topics: {},
    annexes: {},
    addingTopic: false,
    addingAnnexes: false,
    addingNotes: false,
    addingDialogueElements: false
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
    },
    topics: {},
    annexes: {},
    addingTopic: [],
    addingAnnexes: [],
    addingNotes: [],
    addingDialogueElements: []
  }

  lastChangesDate = new Date()

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
      this.collabService.minute.subscribe(response => {
        console.log(response)
        const minute = response.minute as Minute
        const editions = response.editions  as Editions
        this.setLocalEdition(minute)
        this.externalEditions = editions
        this.minute = minute
      });
      this.collabService.editedData.subscribe(response => {
        console.log(response)
        if (this.minute) {
          this.minute[response.name] = response.value
        }
      })
      this.collabService.editions.subscribe(response => {
        console.log(response)
        const externalEditions = response as Editions
        this.externalEditions = externalEditions
      })
      this.collabService.topicEdited.subscribe(response => {
        console.log(response)
        const topicId = response.topicId as String;
        const topicData = response.data as TopicType;
        if (this.minute) {
          const actualTopics = this.minute.topics
          this.minute.topics = actualTopics.map(topic => {
            if(topic._id == topicId) {
              const newTopic = {...topic, topicData} as TopicType
              return newTopic
            }
            return topic
          })
        }
      })
      this.collabService.annexEdited.subscribe(response => {
        console.log(response)
        const annexId = response.annexId as String;
        const annexData = response.data as annexType;
        if (this.minute) {
          const actualAnnexes = this.minute.annexes
          this.minute.annexes = actualAnnexes.map(annex => {
            if(annex._id == annexId) {
              const newAnnex = {...annex, ...annexData} as annexType
              return newAnnex
            }
            return annex
          })
        }
      })
      this.collabService.dialogueElementEdited.subscribe(response => {
        console.log(response)
        const topicId = response.topicId as String;
        const elementId = response.elementId as String;
        const elementData = response.data as DialogueElementType;
        if (this.minute) {
          const topicEdited = this.minute.topics.find(topic =>  topic._id == topicId)
          if (topicEdited) {
            const newElements = topicEdited.dialogueElements.map(element => {
              if(element._id == elementId) {
                const newElement = {...element, ...elementData} as DialogueElementType
                return newElement
              }
              return element
            })
            topicEdited.dialogueElements = newElements
            this.minute.topics = this.minute.topics.map(topic => {
              if(topic._id == topicId) {
                return topicEdited
              }
              return topic
            })
          }
        }
      })
      this.collabService.noteEdited.subscribe(response => {
        console.log(response)
        const topicId = response.topicId as String;
        const noteId = response.noteId as String;
        const noteData = response.data as DialogueElementType;
        if (this.minute) {
          const topicEdited = this.minute.topics.find(topic =>  topic._id == topicId)
          if (topicEdited) {
            const newNotes = topicEdited.notes.map(note => {
              if(note._id == noteId) {
                const newNote = {...note, ...noteData} as NoteType
                return newNote
              }
              return note
            })
            topicEdited.notes = newNotes
            this.minute.topics = this.minute.topics.map(topic => {
              if(topic._id == topicId) {
                return topicEdited
              }
              return topic
            })
          }
        }
      })
      this.collabService.newTopic.subscribe(response => {
        console.log(response)
        const newTopic = response as TopicType
        this.minute?.topics.push(newTopic)
      })
      this.collabService.newAnnex.subscribe(response => {
        console.log(response)
        const newAnnex = response as annexType
        this.minute?.annexes.push(newAnnex)
      })
      this.collabService.newDialogueElement.subscribe(response => {
        console.log(response)
        const topicId = response.topicId as String;
        const newElement = response.newElement as DialogueElementType
        if (this.minute) {
          this.minute.topics = this.minute.topics.map(topic => {
            if(topic._id == topicId) {
              topic.dialogueElements.push(newElement)
            }
            return topic
          })
        }
      })
      this.collabService.newNote.subscribe(response => {
        console.log(response)
        const topicId = response.topicId as String;
        const newNote = response.newNote as NoteType
        if (this.minute) {
          this.minute.topics = this.minute.topics.map(topic => {
            if(topic._id == topicId) {
              topic.notes.push(newNote)
            }
            return topic
          })
        }
      })
      this.collabService.dataSavedDate.subscribe(response => {
        this.lastChangesDate = new Date(response)
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

  setLocalEdition(minute: Minute) {
    const localEditions: any = {
      header: false,
      description: false,
      topics: {},
      annexes: {},
      addingTopic: false,
      addingAnnexes: false,
      addingNotes: false,
      addingDialogueElements: false
    }
    minute.topics.forEach(topic => {
      const notes: any = {}
      const dialogueElements: any = {}
      topic.dialogueElements.forEach(element => {
        dialogueElements[element._id] = false
      })
      topic.notes.forEach(note => {
        notes[note._id] = false
      })
      if (topic._id) {
        localEditions.topics[topic._id] = {
          name: false,
          description: false,
          notes,
          dialogueElements
        }
      }
    })
    minute.annexes.forEach(annex => {
      localEditions.annexes[annex._id] = false
    })
    console.log(localEditions)
    this.localEditions = localEditions
  }
  
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
    //alert('destroy')
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

  addEdit(attribute: Attribute, topicId='') {
    this.localEditions[attribute]= true
    this.collabService.addEdition(attribute, topicId)
  }

  removeEdit(attribute: Attribute, cancel = false, topicId='') {
    this.localEditions[attribute]= false
    this.collabService.removeEdition(attribute)
    if(!cancel) {
      switch(attribute) {
        case 'addingTopic':
          this.collabService.addTopic(this.newTopic)
          break
        case 'addingAnnexes':
          this.collabService.addAnnex(this.newAnnex)
          break
        case 'addingDialogueElements':
          this.collabService.addDialogueElement(topicId, this.newDialogueElement)
          break
        case 'addingNotes':
          this.collabService.addNote(topicId, this.newNote)
          break;
      }
    }
  }

  addTopic() {
    this.localEditions.addingTopic= false
    console.log(this.newTopic)
    this.collabService.addTopic(this.newTopic)
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
