const { validateRequest } = require('../middleware')
const { body } = require('express-validator');
const {
    createUser
} =  require('../controllers/user.controller');

module.exports = (app) => {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    
    app.post(
        "/api/users/create",
        body('name').not().isEmpty().withMessage('El nombre del usuario es obligatorio'),
        body('email').isEmail().withMessage('El email del usuario es obligatorio'),
        body('password').isStrongPassword(),
        [validateRequest],
        createUser
    );
}