const Minute = require('../models/minute.model');
const User = require('../models/user.model');

let minute = undefined;

const editions = {
  header: {
    editing: false,
    editorId: '',
    editorName: ''
  },
  description: {
    editing: false,
    editorId: '',
    editorName: ''
  }
}

module.exports = server => {
  const io = require('socket.io')(server, {
    cors: {
      origin: "http://localhost:4200"
    }
  })

  io.on("connection", socket => {
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

      }
      io.emit("minute", minute);
    });

    socket.on("editBasicData", async (name, value) => {
      //await minute.updateOne({[name]: value});
      minute[name] = value
      socket.broadcast.emit("basicData", {
        name,
        value
      });
    });

    socket.once('getEditions', () => {
      io.emit('editions', editions)
    })

    socket.on("swithEdit", async (attribute, user) => {
      const actualState = editions[attribute]
      if (actualState.editing) {
        if (actualState.editorId == user.id) {
          const newState = {
            editing: false,
            editorId: '',
            editorName: ''
          }
          editions[attribute] = newState
          socket.broadcast.emit('edtionSwitched', {
            attribute,
            value: newState
          })
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
        editions[attribute] = newState
        socket.broadcast.emit('edtionSwitched', {
          attribute,
          value: newState
        })
      }
    });

    /*socket.on("addDoc", doc => {
      documents[doc.id] = doc;
      safeJoin(doc.id);
      io.emit("documents", Object.keys(documents));
      socket.emit("document", doc);
    });

    socket.on("editDoc", doc => {
      documents[doc.id] = doc;
      socket.to(doc.id).emit("document", doc);
    });*/

    io.emit("minute", minute);

    console.log(`Socket ${socket.id} has connected`);
  });
}