const mongoose = require('mongoose');

const { URL } = require('../config/db.config');

mongoose.connect(URL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
.then(() => {
    console.log('Conectado exitosamente a la aplicación')
}, err => {
    console.log(err)
});

mongoose.Promise = global.Promise;

module.exports = mongoose.connection;