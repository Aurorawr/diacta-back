const Minute = require('../models/minute.model');
const User = require('../models/user.model');
const DialogueElement = require('../models/dialogueElement.model');

exports.createPreMinute = async (req, res) => {
    const {
        body : preMinuteData
    } = req;
    const minutesCount = await Minute.estimatedDocumentCount().exec();
    const minuteEnum = minutesCount + 1;

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

exports.updateMinuteData = async (req, res) => {
    const {
        params: {
            minuteId
        },
        body: minuteData
    } = req;
    
    
    Minute.findByIdAndUpdate(minuteId, minuteData, function(err, minute) {
        if (err) {
            return res.status(500).send({ message: err.message });
        }

        return res.send({ message: 'Acta obtenida', minute });
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

exports.getMinutesList = async (req, res) => {
    
    Minute.find({}).select('_id enum date').exec(function(err, minutes) {
        if (err) {
            return res.status(500).send({ message: err.message });
        }

        return res.send({ message: 'Actas obtenidas', minutes });
    });
}

exports.addTopic = async (req, res) => {
    const {
        params: {
            minuteId
        },
        body : topicData
    } = req;
    
    
    const minute = await Minute.findById(minuteId).exec();

    const topicsQuantity = minute.topics.length;

    topicData.enum = topicsQuantity + 1;

    minute.topics.push(topicData);

    minute.save(function(err) {
        if (err) {
            return res.status(500).send({ message: err.message });
        }

        return res.send({ message: 'Tema del acta agregado', topic: minute.topics[topicsQuantity] });
    });
}

exports.addAnnexe = async (req, res) => {
    const {
        params: {
            minuteId
        },
        body : annexeData
    } = req;
    
    
    const minute = await Minute.findById(minuteId).exec();

    const annexesQuantity = minute.annexes.push(annexeData);

    minute.save(function(err) {
        if (err) {
            return res.status(500).send({ message: err.message });
        }

        return res.send({ message: 'Tema del acta agregado', annexe: minute.annexes[annexesQuantity - 1] });
    });
}

exports.addDialogueElement = async (req, res) => {
    const {
        params: {
            minuteId,
            topicId
        },
        body : dialogueElementData
    } = req;
    
    
    const minute = await Minute.findById(minuteId).exec();

    const topic = minute.topics.id(topicId);

    const dialogueElementsQuantity = topic.dialogueElements.length

    dialogueElementData.enum = dialogueElementsQuantity + 1;

    const dialogueElement = await DialogueElement.create(dialogueElementData);

    topic.dialogueElements.push(dialogueElement._id);

    minute.save(function(err) {
        if (err) {
            return res.status(500).send({ message: err.message });
        }

        return res.send({ message: 'Elemento del diálogo agregado', dialogueElement });
    });
}

exports.addNote = async (req, res) => {
    const {
        params: {
            minuteId,
            topicId
        },
        body : noteData
    } = req;
    
    
    const minute = await Minute.findById(minuteId).exec();

    const topic = minute.topics.id(topicId);

    const newNotesQuantity = topic.notes.push(noteData);

    minute.save(function(err) {
        if (err) {
            return res.status(500).send({ message: err.message });
        }

        return res.send({ message: 'Nota agregada', note: topic.notes[newNotesQuantity - 1] });
    });
}