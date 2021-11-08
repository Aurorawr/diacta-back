import { Component, OnInit, OnDestroy, ElementRef, ViewChild, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { MinuteCollabService } from 'src/app/services/minute-collab/minute-collab.service';
import { Minute, TopicType, AnnexType, NoteType, DialogueElementType } from 'src/app/models/minute.model';
import { Editions, Edition } from 'src/app/models/edition.model';
import { EditionParams, SwitchEditionParams } from 'src/app/models/edition-params.model';
import { EditionAttribute } from 'src/app/models/types.model'

import { AddDialogueElementDialog } from 'src/app/dialogs/add-dialogue-element/index.component'
import { AddAnnexDialog } from 'src/app/dialogs/add-annex/index.component'
import { AddNoteDialog } from 'src/app/dialogs/add-note/index.component'
import { AddTopicDialog } from 'src/app/dialogs/add-topic/index.component'

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
  minute!: Minute;
  documents: Observable<string[]> = new Observable();
  currentDoc: string = '';

  newTopic: {name: string, description: string} = {
    name: '',
    description: ''
  }

  newNote: {content: string } = {
    content: ''
  }

  newDialogueElement = {
    enum: 1,
    elementType: 'Acuerdo',
    content: ''
  }

  newAnnex: {url: string, name: string, description: string} = {
    url: '',
    name: '',
    description: ''
  }

  localEditions = {
    header: false,
    description: false
  }

  externalEditions: Editions = {
    header: {
      editing: false,
      editorId: '',
      editorName: ''
    },
    description: {
      editing: false,
      editorId: '',
      editorName: ''
    },
    topicName: {},
    topicDescription: {},
    dialogueElements: {},
    notes: {},
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
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    const minuteId = this.route.snapshot.paramMap.get('minuteId');
    if (minuteId) {
      this.collabService.minute.subscribe(minuteRespone => {
        const minute = minuteRespone as Minute
        this.minute = minute
      });
      this.collabService.editedData.subscribe(response => {
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
        const topicId = response.topicId as string;
        const topicData = response.data as TopicType;
        if (this.minute) {
          const actualTopics = this.minute.topics
          this.minute.topics = actualTopics.map(topic => {
            if(topic._id == topicId) {
              return {...topic, ...topicData} as TopicType
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
        console.log(response)
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
        console.log(response)
        const topicId = response.topicId as string;
        const newNote = response.newNote as NoteType
        if (this.minute && newNote._id) {
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
      this.collabService.errorMessage.subscribe(response => {
        console.log(response)
      })
      if (!this.minute) {
        this.collabService.initMinute(minuteId)
      }
    }
  }

  ngOnDestroy() {
    this.collabService.disconnect()
  }

  editBasicData(name: string, event: KeyboardEvent) {
    const target = event.target as HTMLTextAreaElement;
    const value = target.value;

    this.collabService.editBasicData(name, value);
  }

  switchEdit(params: SwitchEditionParams) {
    const {
      attribute,
      attributeId
    } = params
    this.collabService.switchEdition(attribute, attributeId)
    if (attribute == 'header' || attribute == 'description') {
      this.localEditions[attribute] = !this.localEditions[attribute]
    }
  }

  addEdit(attribute: EditionAttribute, topicId='') {
    this.collabService.addEdition(attribute, topicId)
  }

  addDialogueElement(topicId: string | undefined) {
    if (topicId) {
      this.collabService.addEdition('addingDialogueElements', topicId)
      const dialogRef = this.dialog.open(AddDialogueElementDialog, {
        width: '50vw',
        data: {
          enum: this.getNewDialogueElementEnum(topicId),
          elementType: 'Acuerdo',
          content: ''
        }
      })

      dialogRef.afterClosed().subscribe(dialogueElementData => {
        if (dialogueElementData) {
          this.newDialogueElement = dialogueElementData
          this.removeEdit('addingDialogueElements', false, topicId)
        }
        else {
          this.removeEdit('addingDialogueElements', true, topicId)
        }
      })
    }
  }

  addNote(topicId: string | undefined) {
    if (topicId) {
      this.collabService.addEdition('addingNotes', topicId)
      const dialogRef = this.dialog.open(AddNoteDialog, {
        width: '50vw',
        data: {
          content: ''
        }
      })

      dialogRef.afterClosed().subscribe(noteData => {
        if (noteData) {
          console.log(noteData)
          this.newNote = noteData
          this.removeEdit('addingNotes', false, topicId)
        }
        else {
          this.removeEdit('addingNotes', true, topicId)
        }
      })
    }
  }

  addTopic() {
    this.collabService.addEdition('addingTopic')
    const dialogRef = this.dialog.open(AddTopicDialog, {
      width: '50vw',
      data: {
        name: '',
        description: ''
      }
    })

    dialogRef.afterClosed().subscribe(topicData => {
      if (topicData) {
        this.newTopic = topicData
        this.removeEdit('addingTopic', false)
      }
      else {
        this.removeEdit('addingTopic', true)
      }
    })
  }

  addAnnex() {
    this.collabService.addEdition('addingAnnexes')
    const dialogRef = this.dialog.open(AddAnnexDialog, {
      width: '50vw',
      data: {
        annex: {
          url: '',
          name: '',
          description: ''
        }
      }
    })

    dialogRef.afterClosed().subscribe(annexData => {
      if (annexData) {
        this.newAnnex = annexData
        this.removeEdit('addingAnnexes', false)
      }
      else {
        this.removeEdit('addingAnnexes', true)
      }
    })
  }

  editTopicAttribute(params: EditionParams) {
    const {
      topicId,
      elementType,
      elementId,
      event
    } = params
    const target = event.target as HTMLTextAreaElement;
    const value = target.value;
    if (topicId && elementId) {
      switch(elementType) {
        case 'dialogueElements':
          this.collabService.editDialogueElement(
            topicId,
            elementId,
            {
              content: value
            }
          );
          break
        case 'notes':
          this.collabService.editNote(
            topicId,
            elementId,
            {
              content: value
            }
          )
          break
        default:
          
      }
    }
    else if (elementId) {
      const topicData: any = {}
      switch(elementType) {
        case 'topicName':
          topicData.name = value
          break
        case 'topicDescription':
          topicData.description = value
          break
        default:
      }
      this.collabService.editTopic(elementId, topicData)
    }
  }

  editAnnex(annex: AnnexType) {
    this.collabService.switchEdition('annexes', annex._id)
    const onEditAnnex = new EventEmitter();
    onEditAnnex.subscribe(annexData => {
      this.collabService.editAnnex(annex._id, annexData)
    })
    const dialogRef = this.dialog.open(AddAnnexDialog, {
      width: '50vw',
      data: {
        annex,
        onEdit: onEditAnnex
      }
    })

    dialogRef.afterClosed().subscribe(() => {
      this.collabService.switchEdition('annexes', annex._id)
    })
  }

  removeEdit(attribute: EditionAttribute, cancel = false, topicId='') {
    this.collabService.removeEdition(attribute)
    if(!cancel) {
      switch(attribute) {
        case 'addingTopic':
          this.collabService.addTopic(this.newTopic)
          this
          break
        case 'addingAnnexes':
          this.collabService.addAnnex(this.newAnnex)
          break
        case 'addingDialogueElements':
          this.collabService.addDialogueElement(topicId, this.newDialogueElement)
          break
        case 'addingNotes':
          console.log('hola')
          console.log(this.newNote)
          this.collabService.addNote(topicId, this.newNote)
          break;
      }
    }
  }

  filterEditions(editions: Edition[] ,topicId: string | undefined) {
    if (topicId) {
      return editions.filter(edition => edition.topicId == topicId)
    }
    return []
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

  getNewDialogueElementEnum(topicId: string) {
    const topic = this.minute.topics.find(topic => topic._id == topicId)
    if (topic) {
      return topic.dialogueElements.length + 1
    }
    return 0
  }

  getDialogueElementSuffix(el: DialogueElementType) {
    return `${el.elementType} ${this.minute.enum}.${el.enum}: `
  }

  getAnnexExtEdition(annexId: string) : Edition {
    const externalAnnexEdit = this.externalEditions.annexes[annexId]
    if (externalAnnexEdit) {
      return externalAnnexEdit
    }
    return {
      editing: false,
      editorId: '',
      editorName: ''
    }
  }

}
