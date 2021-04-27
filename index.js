if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require('./src/db/connection')

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const app = express();

var corsOptions = {
  origin: "http://localhost:4200"
};

/*const adminData = {
  name: 'Admin',
  lastname: 'Bdt',
  email: 'admin_bdt@mail.com',
  password: bcrypt.hashSync('AdminBDT<3', 8),
  isAdmin: true
}

const testAdmin = new User(adminData);

testAdmin.save(err => {
  if (err) console.log('Error al crear :C');

  console.log('guardado!');
  console.log(testAdmin.toJSON());
})*/

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

require('./src/routes/auth.routes') (app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
