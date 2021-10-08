const { verifyToken } = require('../middleware')
const {
    createReminder,
    getUserReminders
} =  require('../controllers/reminder.controller')

module.exports = (app) => {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        '/api/reminder',
        [verifyToken],
        createReminder
    )

    app.get(
        '/api/reminders/:userId',
        [verifyToken],
        getUserReminders
    )

}