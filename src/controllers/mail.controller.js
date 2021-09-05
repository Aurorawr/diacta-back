const {transporter} = require('../config/transporter.config')

exports.sendMail =  async () => {
    const info = await transporter.sendMail({
        from: 'BdT San Miguel <no-responder@bdt.cl>',
        to: "lucas.quintanilla@usach.cl",
        subject: "Bienvenido al Banco",
        text: "Esto funciona?",
        html: "<h1>Esto funciona?</h1>"
    })

    console.log(info)
}