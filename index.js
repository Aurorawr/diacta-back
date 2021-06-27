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

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

require('./src/routes/auth.routes') (app);
require('./src/routes/user.routes') (app);
require('./src/routes/minute.routes') (app);

// Serve static files
app.use(express.static(__dirname + '/front/dist/front'));

// Send all requests to index.html
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/front/dist/front/index.html'));
});

const server = require('http').createServer(app);
const io = require('socket.io')(server)

// set port, listen for requests
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
