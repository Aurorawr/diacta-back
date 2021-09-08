import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { MinuteCollabService } from 'src/app/services/minute-collab/minute-collab.service';
import { Minute, TopicType, AnnexType, NoteType, DialogueElementType } from 'src/app/models/minute.model';

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

  @ViewChild('headerInput') headerInput!:ElementRef;

  constructor(
    private collabService: MinuteCollabService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const minuteId = this.route.snapshot.paramMap.get('minuteId');
    if (minuteId) {
      this.collabService.minute.subscribe(response => {
        const minute = response.minute as Minute
        const editions = response.editions  as Editions
        this.setLocalEdition(minute)
        this.externalEditions = editions
        this.minute = minute
      });
      this.collabService.editedData.subscribe(response => {
        if (this.minute) {
          this.minute[response.name] = response.value
        }
      })
      this.collabService.editions.subscribe(response => {
        const externalEditions = response as Editions
        this.externalEditions = externalEditions
      })
      this.collabService.topicEdited.subscribe(response => {
        const topicId = response.topicId as string;
        const topicData = response.data as TopicType;
        if (this.minute) {
          const actualTopics = this.minute.topics
          this.minute.topics = actualTopics.map(topic => {
            if(topic._id == topicId) {
              return {...topic, topicData} as TopicType
            }
            return topic
          })
        }
      })
      this.collabService.annexEdited.subscribe(response => {
        const annexId = response.annexId as string;
        const annexData = response.data as AnnexType;
        if (this.minute) {
          const actualAnnexes = this.minute.annexes
          this.minute.annexes = actualAnnexes.map(annex => {
            if(annex._id == annexId) {
              return {...annex, ...annexData} as AnnexType
            }
            return annex
          })
        }
      })
      this.collabService.dialogueElementEdited.subscribe(response => {
        const topicId = response.topicId as string;
        const elementId = response.elementId as string;
        const elementData = response.data as DialogueElementType;
        if (this.minute) {
          const topicEdited = this.minute.topics.find(topic =>  topic._id == topicId)
          if (topicEdited) {
            const newElements = topicEdited.dialogueElements.map(element => {
              if(element._id == elementId) {
                return {...element, ...elementData} as DialogueElementType
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
        const topicId = response.topicId as string;
        const noteId = response.noteId as string;
        const noteData = response.data as DialogueElementType;
        if (this.minute) {
          const topicEdited = this.minute.topics.find(topic =>  topic._id == topicId)
          if (topicEdited) {
            const newNotes = topicEdited.notes.map(note => {
              if(note._id == noteId) {
                return {...note, ...noteData} as NoteType
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
        const newTopic = response as TopicType
        this.minute?.topics.push(newTopic)
      })
      this.collabService.newAnnex.subscribe(response => {
        const newAnnex = response as AnnexType
        this.minute?.annexes.push(newAnnex)
      })
      this.collabService.newDialogueElement.subscribe(response => {
        const topicId = response.topicId as string;
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
        const topicId = response.topicId as string;
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
      if (!this.minute) {
        this.collabService.initMinute(minuteId)
      }
    }
  }

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
    this.localEditions = localEditions
  }
  
  switchPendingEditions() {
    Object.entries(this.localEditions).forEach(([attribute, value]) => {
      if(value) {
        this.collabService.switchEdition(attribute)
      }
    })
  }

  ngOnDestroy() {
    this.collabService.disconnect()
  }

  editBasicData(name: string, event: KeyboardEvent) {
    const target = event.target as HTMLTextAreaElement;
    const value = target.value;

    this.collabService.editBasicData(name, value);
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
      return `${minute.place}, ${dateStr}. ${convokedTimeStr}.${startTimeStr}`;
    }
    return ''
  }

}
