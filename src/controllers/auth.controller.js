const User = require('../models/user.model');
const {secret} = require('../config/auth.config');

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signIn = (req, res) => {
    const {
        body: {
            email,
            password
        }
    } = req;

    User.findOne({email}, (err, user) => {
        if (err) {
            return res.status(500).send({ message: err.message });
        }

        if (!user) {
            return res.status(404).send({message: 'No existe un usuario con el email indicado'});
        }

        const {
            id,
            password : dbPasword
        } = user;

        const passwordIsValid = bcrypt.compareSync(password, dbPasword);
        if (!passwordIsValid) {
            return res.status(401).send({message: "Contraseña incorrecta"});
        }

        const token = jwt.sign({id}, secret, {expiresIn: 86400 });

        return res.send({message: 'Ha iniciado sesión exitosamente', user: user.toJSON(), token});
    })
}