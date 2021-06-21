const Minute = require('../models/minute.model');
const User = require('../models/user.model');
const DialogueElement = require('../models/dialogueElement.model');

exports.createPreMinute = async (req, res) => {
    const {
        body : preMinuteData
    } = req;
    const minutesCount = await Minute.estimatedDocumentCount().exec();
    const minuteEnum = minutesCount + 1;
    console.log(minutesCount)
    console.log(minuteEnum)
    const users = await User.find({}).select('_id').exec();

    const participants = users.map(user => {
        return {
            user: user._id
        }
    });

    preMinuteData.enum = minuteEnum;
    preMinuteData.participants = participants;
    
    Minute.create(preMinuteData, function(err, minute) {
        if (err) {
            return res.status(500).send({ message: err.message });
        }

        return res.send({ message: 'Acta inicializada', minute });
    });
}

exports.getPreMinute = async (req, res) => {
    const {
        params: {
            minuteId
        }
    } = req;
    
    
    const query = Minute.findById(minuteId);

    query.populate({
        path: 'participants',
        populate: {
            path: 'user'
        }
    });

    query.populate({
        path: 'topics',
        populate: {
            path: 'dialogueElements'
        }
    });

    query.populate({
        path: 'previuosCompromises'
    });

    query.exec(function(err, minute) {
        if (err) {
            return res.status(500).send({ message: err.message });
        }

        return res.send({ message: 'Acta obtenida', minute });
    });
}