const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const {secret} = require("../config/auth.config.js");

const getToken = (headers) => {
  const authHeader = headers['authorization']
  if(authHeader) {
    const headerData = authHeader.split(' ')
    if (headerData.length == 2 && headerData[0] == 'Bearer') {
      return headerData[1]
    }
  }
  return null
}

const verifyToken = (req, res, next) => {
  let token = getToken(req.headers);

  if (!token) {
    return res.status(403).send({
      message: "No se ha ingressado un token"
    });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "No está autorizado para realizar esta acción"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = (req, res, next) => {
  const {
    userId
  } = req;
  User.findById(userId, (err, user) => {
    if (err) {
      return res.status(500).send({
        message: "Hubo un problema al validar su usuario"
      });
    }

    if (!user) {
      return res.status(403).send({
        message: "El usuario no existe"
      });
    }

    if (user.isAdmin) {
      next();
      return;
    }

    return res.status(403).send({
      message: "No posee el rol correspondiente para realizar esta acción"
    });
  })
};

const authJwt = {
    verifyToken,
    isAdmin
};

module.exports = authJwt;