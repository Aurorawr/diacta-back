const { validateRequest } = require('../middleware')
const { body } = require('express-validator');
const {
    signIn,
    signUp
} =  require('../controllers/auth.controller');

module.exports = (app) => {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    
    app.post(
        "/api/auth/signup",
        body('name').isLength({min: 1}).withMessage('El nombre del usuario es obligatorio'),
        body('email').isEmail().withMessage('El email del usuario es obligatorio'),
        body('password').isStrongPassword(),
        [validateRequest],
        signUp
    );
    
    app.post(
        "/api/auth/signin",
        body('email').isEmail().withMessage('El email del usuario es obligatorio'),
        body('password').isStrongPassword(),
        [validateRequest],
        signIn
    );
}