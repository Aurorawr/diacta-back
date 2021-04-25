const {User} = require("../models");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No se ha ingressado un token"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "No está autorizado para realizar esta acción"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getUserType().then(type => {
      const {
          name
      } = type;

      if (name == 'Administrador') {
        next();
        return;
      }

      res.status(403).send({
        message: "No posee el rol correspondiente para realizar esta acción"
      });
      return;
    });
  });
};

const authJwt = {
    verifyToken,
    isAdmin
};

module.exports = authJwt;