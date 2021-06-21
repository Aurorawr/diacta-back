const { validateRequest } = require('../middleware')
const { body } = require('express-validator');
const {
    createPreMinute,
    getPreMinute
} =  require('../controllers/minute.controller');

module.exports = (app) => {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    
    app.post(
        "/api/minutes",
        //body('email').isEmail().withMessage('El email del usuario es obligatorio'),
        //body('password').isStrongPassword(),
        //[validateRequest],
        createPreMinute
    );

    app.get(
        "/api/minutes/:minuteId",
        //body('email').isEmail().withMessage('El email del usuario es obligatorio'),
        //body('password').isStrongPassword(),
        //[validateRequest],
        getPreMinute
    );
}