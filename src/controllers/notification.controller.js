const {transporter} = require('../config/transporter.config')
const {twilioClient} = require('../config/twilio.config')
const Email = require('email-templates')
const path = require('path');


exports.sendMail = (templateName, to, locals) => {
    const email = new Email({
        message: {
            from: 'BdT San Miguel <no-responder@bdt.cl>'
        },
        send: true,
        transport: transporter
    })

    email.send({
        template: path.join(__dirname, 'emails', templateName),
        message: {
            to: to
        },
        locals: locals
    }).then(console.log).catch(console.error)
}

exports.sendSMS = (cellphoneNumber, textMessage) => {
    twilioClient.messages.create({
        to: cellphoneNumber,
        from: '+16782702361',
        body: textMessage
    }).then(message => {
        console.log(message)
    })
}
