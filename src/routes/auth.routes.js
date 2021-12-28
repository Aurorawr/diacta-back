const { validateRequest } = require('../middleware')
const { body } = require('express-validator');
const {
    signIn
} =  require('../controllers/auth.controller');

const {
    sendMail,
    sendSMS
} =  require('../controllers/notification.controller');

module.exports = (app) => {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    
    app.post(
        "/api/auth/signin",
        body('email').isEmail().withMessage('El email del usuario es obligatorio'),
        body('password').not().isEmpty().withMessage('La contraseña del usuario es obligatoria'),
        [validateRequest],
        signIn
    );

    app.get('/api/test', function(req, res) {
        sendMail()
        res.send({message: "Mail"})
    })
}