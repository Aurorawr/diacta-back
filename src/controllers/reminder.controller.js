const Reminder = require('../models/reminder.model')
const User = require('../models/user.model');
const sanitize = require('mongo-sanitize')
const schedule = require('node-schedule');

const scheduleReminder = (reminderData) => {

    const {
        when,
        vias,
        event
    } = reminderData

    const reminderDate = new Date(2021, 8, 5, 22, 24, 0);

    schedule.scheduleJob(reminderDate, this.sendMail)
}

exports.createReminder = (req, res) => {
    const {
        body: {
            reminder,
            userId
        }
    } = req
    
    const user = User.findById(sanitize(userId)).exec()
    const reminderData = sanitize(reminder)
    const newReminder = new Reminder(reminderData)

    newReminder.save(function(err) {
        if (err) {
            return res.status(500).send({ message: err.message });
        }

        user.reminders.push(newReminder._id)

        user.save(function(err) {
            if (err) {
                return res.status(500).send({ message: err.message });
            }
            return res.send({ message: "Recordatorio creado exitosamente", reminder: newReminder.toJSON() });
        })
    })
}