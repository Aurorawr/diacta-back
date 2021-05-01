const Minute = require('../models/minute.model');

exports.initMinute = (req, res) => {
    const minutesCount = Minute.estimatedDocumentCount();
    const minuteIndex = minutesCount + 1;

    Minute.create({enum: minuteIndex}, function(err, minute) {
        if (err) {
            return res.status(500).send({ message: err.message });
        }

        return res.send({ message: 'Acta inicializada', minute: minute.toJSON() });
    });
}