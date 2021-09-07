const Minute = require('../models/minute.model');
const DialogueElement = require('../models/dialogueElement.model');
const Task = require('../models/task.model.js');

const DEFAULT_EDITION = {
  editing: false,
  editorId: '',
  editorName: ''
}

let minute = undefined;

const editions = {};

module.exports = (io, socket) => {
  
  let currentId;

  const safeJoin = newId => {
    socket.leave(currentId);
    socket.join(newId, () => console.log(`Socket ${socket.id} joined room ${newId}`));
    currentId = newId;
  };

  socket.on("initMinute", async minuteId => {
    if (!minute) {
      safeJoin(minuteId);
      const query = Minute.findById(minuteId);

      query.populate({
          path: 'participants',
          populate: {
              path: 'user'
          }
      });

      query.populate({
          path: 'topics',
          populate: {
              path: 'dialogueElements'
          }
      });

      query.populate('previousCompromises');

      minute = await query.exec();

      console.log('estoy dentro')

      editions.header = DEFAULT_EDITION
      editions.description = DEFAULT_EDITION
      editions.topics = {}
      editions.annexes = {}
      editions.addingTopic = []
      editions.addingAnnexes = []
      editions.addingNotes = []
      editions.addingDialogueElements = []

      minute.topics.forEach(topic => {
        const notes = {}
        const dialogueElements = {}
        topic.notes.forEach(note => {
          notes[note._id] = DEFAULT_EDITION
        })
        topic.dialogueElements.forEach(element => {
          dialogueElements[element._id] = DEFAULT_EDITION
        })
        editions.topics[topic._id] = {
          name: DEFAULT_EDITION,
          description: DEFAULT_EDITION,
          notes,
          dialogueElements
        }
      })

      minute.annexes.forEach(annex => {
        editions.annexes[annex._id] = DEFAULT_EDITION
      })

    }
    io.emit("minute", {
      minute,
      editions
    });
  });

  socket.on("editBasicData", (name, value) => {
    minute[name] = value
    socket.broadcast.emit("basicData", {
      name,
      value
    });
  });

  socket.on("editTopic", (topicId, data) => {
    const {
      name,
      description
    } = data
    if (name) {
      minute.topics.id(topicId).name = name
    }
    if (description) {
      minute.topics.id(topicId).description = description
    }
    socket.broadcast.emit("topicEdited", {
      topicId,
      data
    });
  });

  socket.on("editAnnex", (annexId, data) => {
    const {
      url,
      name,
      description
    } = data
    if (url) {
      minute.annexes.id(annexId).url = url
    }
    if (name) {
      minute.annexes.id(annexId).name = name
    }
    if (description) {
      minute.annexes.id(annexId).description = description
    }
    socket.broadcast.emit("annexEdited", {
      annexId,
      data
    });
  });

  socket.on("editDialogueElement", (topicId, elementId, data) => {
    const {
      type,
      content
    } = data
    socket.broadcast.emit("dialogueElementEdited", {
      topicId,
      elementId,
      data
    });
  });

  socket.on("editNote", (topicId, noteId, data) => {
    const {
      content
    } = data
    if (content) {
      minute.topics.id(topicId).notes.id(noteId).content = content
    }

    socket.broadcast.emit("noteEdited", {
      topicId,
      noteId,
      data
    });
  });

  socket.on("addTopic", (topic) => {
    const topicsQuantity = minute.topics.length
    topic.enum = topicsQuantity+1
    minute.topics.push(topic)
    const savedTopic = minute.topics[topicsQuantity]
    io.emit("newTopic", savedTopic);
  });

  socket.on("addAnnex", (annex) => {
    minute.annexes.push(annex)
    const savedAnnex = minute.annexes[minute.annexes.length-1]
    io.emit("newAnnex", savedAnnex);
  });

  socket.on("addDialogueElement", async (topicId, element) => {
    const topic = minute.topics.id(topicId)
    const elementsQuantity = topic.dialogueElements.length
    element.enum = elementsQuantity+1
    element.references = {
      minuteEnum: minute.enum,
      topicEnum: topic.enum
    }
    const newElement = new DialogueElement(element)
    minute.topics.id(topicId).dialogueElements.push(newElement)
    io.emit("newDialogueElement", {
      topicId,
      newElement: newElement
    });
    const savedElement = await newElement.save();
    if (savedElement == newElement) {
      io.emit('dataSaved', new Date())
      if(savedElement.elementType == 'Compromiso') {
        const newTask = new Task({
          compromise: savedElement._id,
        })
        await newTask.save()
      }
    }
  });

  socket.on("addNote", (topicId, note) => {
    const notesQuantity = minute.topics.id(topicId).notes.length
    minute.topics.id(topicId).notes.push(note)
    const savedNote = minute.topics.id(topicId).notes[notesQuantity]
    io.emit("newNote", {
      topicId,
      newNote: savedNote
    });
  });

  socket.on("swithEdit", async (attribute, user, options=null) => {
    let actualState = null
    let editionType = ''
    if (options) {
      const {
        topicId,
        annexId,
        attributeId
      } = options
      if(topicId) {
        if (attributeId) {
          actualState = editions.topics[topicId][attribute][attributeId]
          editionType = 'topicAttr'
        }
        else {
          actualState = editions.topics[topicId][attribute]
          editionType = 'topic'
        }
      }
      else if (annexId) {
        actualState = editions.annexes[annexId]
        editionType = 'annex'
      }
      else {
        socket.emit('errorMessage', 'Malas opciones para la edición')
        return
      }
    }
    else {
      actualState = editions[attribute]
      editionType = 'basic'
    }
    if (actualState.editing) {
      if (actualState.editorId == user.id) {
        const newState = {
          editing: false,
          editorId: '',
          editorName: ''
        }
        switch(editionType) {
          case 'basic':
            editions[attribute] = newState
            break
          case 'topic':
            editions.topics[topicId][attribute] = newState
            break
          case 'topicAttr':
            editions.topics[topicId][attribute][attributeId] = newState
          case 'annex':
            editions.annexes[annexId] = newState
          default:
        }
        socket.broadcast.emit('editions', editions)
      }
      else {
        socket.emit('errorMessage', 'El campo ya está siendo editado')
      }
    }
    else {
      const newState = {
        editing: true,
        editorId: user.id,
        editorName: user.name
      }
      switch(editionType) {
        case 'basic':
          editions[attribute] = newState
          break
        case 'topic':
          editions.topics[topicId][attribute] = newState
          break
        case 'topicAttr':
          editions.topics[topicId][attribute][attributeId] = newState
        case 'annex':
          editions.annexes[annexId] = newState
        default:
      }
      socket.broadcast.emit('editions', editions)
    }
  });

  socket.on('addEdition', (key, user, topicId=null) => {
    const newEdition = {
      editing: true,
      editorId: user.id,
      editorName: user.name
    }
    if(topicId) {
      newEdition.topicId = topicId
    }
    editions[key].push(newEdition)
    socket.broadcast.emit('editions', editions)
  })

  socket.on('removeEdition', (key, user) => {
    const filteredEditions = editions[key].filter(edition => edition.editorId != user.id)
    editions[key] = filteredEditions
    socket.broadcast.emit('editions', editions)
  })

  socket.on("disconnect", (reason) => {
    console.log(`Socket ${socket.id} has disconnected by ${reason}`)
  });

  console.log(`Socket ${socket.id} has connected`);
}