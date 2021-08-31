const { validateRequest, verifyToken } = require('../middleware')
const { body } = require('express-validator');
const {
    createUser,
    editUser,
    getAllUsers
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
        "/api/users",
        body('name').not().isEmpty().withMessage('El nombre del usuario es obligatorio'),
        body('email').isEmail().withMessage('El email del usuario es obligatorio'),
        body('password').not().isEmpty().withMessage('La contraseña del usuario es obligatoria'),
        [validateRequest, verifyToken],
        createUser
    );

    app.put(
        "/api/users/:userId",
        [validateRequest, verifyToken],
        editUser
    );

    app.get(
        "/api/users",
        [verifyToken],
        getAllUsers
    );
}