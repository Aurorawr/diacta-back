const { validateRequest } = require('../middleware')
const { body } = require('express-validator');
const {
    createPreMinute,
    getPreMinute,
    addDialogueElement,
    addNote,
    addTopic,
    updateMinuteData,
    addAnnexe
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

    app.put(
        "/api/minutes/:minuteId",
        //body('email').isEmail().withMessage('El email del usuario es obligatorio'),
        //body('password').isStrongPassword(),
        //[validateRequest],
        updateMinuteData
    );

    app.post(
        "/api/minutes/:minuteId/topics",
        //body('email').isEmail().withMessage('El email del usuario es obligatorio'),
        //body('password').isStrongPassword(),
        //[validateRequest],
        addTopic
    );

    app.post(
        "/api/minutes/:minuteId/annexes",
        //body('email').isEmail().withMessage('El email del usuario es obligatorio'),
        //body('password').isStrongPassword(),
        //[validateRequest],
        addAnnexe
    );

    app.post(
        "/api/minutes/:minuteId/topics/:topicId/dialogueElement",
        //body('email').isEmail().withMessage('El email del usuario es obligatorio'),
        //body('password').isStrongPassword(),
        //[validateRequest],
        addDialogueElement
    );

    app.post(
        "/api/minutes/:minuteId/topics/:topicId/note",
        //body('email').isEmail().withMessage('El email del usuario es obligatorio'),
        //body('password').isStrongPassword(),
        //[validateRequest],
        addNote
    );
}