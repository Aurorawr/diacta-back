if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const cors = require("cors");
const db = require('./src/db/connection')

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const app = express();

var corsOptions = {
  origin: "http://localhost:4200"
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

require('./src/routes/auth.routes') (app);
require('./src/routes/user.routes') (app);
require('./src/routes/minute.routes') (app);
require('./src/routes/reminder.routes') (app);

app.use(express.static(__dirname + '/public'));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

const server = require('http').Server(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:4200"
  }
})

const registerMinuteCollabHandlers = require('./src/controllers/minute-collab.controller')
const registerTasksHandlers = require('./src/controllers/task.controller')
const minuteCollab = io.of('/minute-collab')
const tasks = io.of('/tasks')
minuteCollab.on('connection', (socket) => {
  registerMinuteCollabHandlers(minuteCollab, socket)
})
tasks.on('connection', (socket) => {
  registerTasksHandlers(tasks, socket)
})

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
