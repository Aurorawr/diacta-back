const Reminder = require('../models/reminder.model')
const User = require('../models/user.model');
const sanitize = require('mongo-sanitize')
const schedule = require('node-schedule');

const {
    sendMail,
    sendSMS
} = require('./notification.controller')

const scheduleReminder = (reminderData, user) => {

    const {
        when,
        vias,
        event,
        message
    } = reminderData
    const {
        name,
        email,
        cellphone
    } = user

    let reminderMessage = ""
    let url = ""
    let emailTemplate = ""
    if (event == 'Reunión') {
        reminderMessage = "Se aproximan nuevas reuniones. Recuerda revisar las fechas de estas y revisar las actas preparadas."
        url = "https://diacta.herokuapp.com/actas"
        emailTemplate = "meets"
    }
    else if (event == 'Tareas') {
        reminderMessage = "No te olvides de revisar tus tareas pendientes y ponerte al día con ellas para seguir avanzando."
        url = "https://diacta.herokuapp.com/tareas"
        emailTemplate = "tasks"
    }
    else if (event == 'Personalizado' && message) {
        reminderMessage = message
        emailTemplate = "custom"
    }

    vias.forEach(via => {
        if (via == 'Email') {
            const locals = {
                name,
                message: reminderMessage
            }
            schedule.scheduleJob(when, function () {
                sendMail(emailTemplate, email, locals)
            })
        }
        else if (via = "SMS" && cellphone) {
            const smsText = `Hola ${name}. ${reminderMessage} ${url.length ? "Link: " + url : ""}`
            schedule.scheduleJob(when, function () {
                sendSMS(cellphone, smsText)
            })
        }
    })
}

exports.createReminder = async (req, res) => {
    const {
        params: {
            userId
        },
        body: reminder
    } = req
    
    const user = await User.findById(sanitize(userId)).exec()
    const reminderData = sanitize(reminder)
    console.log(reminderData)
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
            scheduleReminder(reminderData, user)
            return res.send({ message: "Recordatorio creado exitosamente", reminder: newReminder.toJSON() });
        })
    })
}

exports.getUserReminders = async (req, res) => {
    const {
        params: {
            userId
        }
    } = req;

    const user = await User.findById(sanitize(userId)).populate('reminders').select('reminders').exec()

    return res.send({ message: "Recordatorios obtenidos exitosamente", reminders: user.reminders });
}