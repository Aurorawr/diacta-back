const schedule = require('node-schedule');
const {transporter} = require('../config/transporter.config')
const {twilioClient} = require('../config/twilio.config')

exports.sendMail = async () => {
    const info = await transporter.sendMail({
        from: 'BdT San Miguel <no-responder@bdt.cl>',
        to: "lucas.quintanilla@usach.cl",
        subject: "Bienvenido al Banco",
        text: "Esto funciona?",
        html: "<h1>Esto funciona?</h1>"
    })
}

exports.sendSMS = () => {
    twilioClient.messages.create({
        to: '+56975805354',
        from: '+16782702361',
        body: "Prueba de mensaje de texto"
    }).then(message => {
        console.log(message)
    })
}

exports.scheduleReminder = () => {

    const reminderDate = new Date(2021, 8, 5, 22, 24, 0);

    const job = schedule.scheduleJob(reminderDate, this.sendMail)
}