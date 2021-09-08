const User = require('../models/user.model');
const {bcrypt_salt} = require('../config/auth.config');

var bcrypt = require("bcryptjs");

exports.createUser = (req, res) => {
    const {
        body : userData
    } = req;
    const {
        password
    } = userData;

    salt = bcrypt.genSaltSync(parseInt(bcrypt_salt))
    userData.password = bcrypt.hashSync(password, salt);
    User.create(userData, function(err, newUser) {
        if (err) return res.status(500).send({ message: err.message });

        return res.send({message: 'Usuario creado exitosamente', user: newUser.toJSON()});
    })

};

exports.getAllUsers = (req, res) => {
    
    const query = User.find({});

    query.exec(function(err, users) {
        if (err) return res.status(500).send({ message: err.message });

        return res.send({message: 'Usuarios obtenidos exitosamente', users});
    });
};

exports.editUser = (req, res) => {
    const {
        params: {
            userId
        },
        body : userData
    } = req;

    User.findByIdAndUpdate(userId, userData, {new: true},  function(err, user) {
        if (err) return res.status(500).send({ message: err.message });

        return res.send({message: 'Usuario editado exitosamente', user: user.toJSON()});
    })
};
