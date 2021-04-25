const {User} = require('../models');
const {secret} = require('../config/auth.config');

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signUp = (req, res) => {
    const {
        body: {
            name,
            lastname,
            email,
            password
        }
    } = req;
    User.create({
        name,
        lastname,
        email,
        password: bcrypt.hashSync(password, 8),
        userTypeId: 2
    }).then(user => {
        remove
        res.send({
            message: 'Usuario registrado con éxito',
            user: user.toJSON()
        });
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.signIn = (req, res) => {
    const {
        body: {
            email,
            password
        }
    } = req;

    User.findOne({where: {email}}).then(user => {
        if (!user) {
            res.status(404).send({message: 'No existe un usuario con el email indicado'});
        }

        const {
            id,
            password : dbPasword
        } = user;

        const passwordIsValid = bcrypt.compareSync(password, dbPasword);
        if (!passwordIsValid) {
            res.status(401).send({message: "Contraseña incorrecta"});
        }

        const token = jwt.sign({id}, secret, {expiresIn: 86400 });

        res.send({message: 'Ha iniciado sesión exitosamente', user: user.toJSON(), token});
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
}