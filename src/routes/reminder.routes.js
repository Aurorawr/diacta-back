const { validateRequest, verifyToken } = require('../middleware')
const { body } = require('express-validator');
const {
    sendTasksEmail
} =  require('../controllers/notification.controller')

module.exports = (app) => {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get('/api/reminder/sendMail', function (req, res) {
        sendTasksEmail("lucas.quintanilla@usach.cl")

        res.send({message: "Enviado?"})
    })

}