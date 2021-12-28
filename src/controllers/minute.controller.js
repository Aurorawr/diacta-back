const Minute = require('../models/minute.model');
const User = require('../models/user.model');
const DialogueElement = require('../models/dialogueElement.model');
const Task = require('../models/task.model');
const sanitize = require('mongo-sanitize');
const { sendMail } = require('./notification.controller');

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

    const previousCompromises = await this.getPreviousCompromises()

    const previousCompromisesIds = previousCompromises.map(compromise => compromise._id)


    preMinuteData.enum = minuteEnum;
    preMinuteData.participants = participants;
    preMinuteData.previousCompromises = previousCompromisesIds
    const sanitizedPreminute = sanitize(preMinuteData)
    Minute.create(sanitizedPreminute, function(err, minute) {
        if (err) {
            return res.status(500).send({ message: err.message });
        }

        users.forEach(user => {
            sendMail(
                "minute",
                user.email,
                {
                    name: user.name,
                    subjectMessage: "se ha preparado un acta",
                    message: "Se ha preparado una nueva acta. Recomendamos leerla antes de la reunión.",
                    minuteId: minute._id
                }
            )
        })

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

    query.populate('previousCompromises');

    query.exec(function(err, minute) {
        if (err) {
            return res.status(500).send({ message: err.message });
        }
        if(!minute) {
            return res.status(400).send({ message: 'No existe un acta con el id indicado' });
        }
        return res.send({ message: 'Acta obtenida', minute: minute.toJSON() });
    });
}

exports.getMinutesList = async (req, res) => {
    
    Minute.find({}).select('_id enum date phase').sort('-enum').exec(function(err, minutes) {
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

exports.getPreviousCompromises = async () => {

    const incompleteTasks = await Task.find({
        state: { $ne: 4}
    }).populate({
        path: 'compromise',
        select: '_id enum content references'
    })
    .exec();

    const previuosCompromises = incompleteTasks.map(task => {
        const compromise = task.compromise
        return compromise.toJSON()
    })

    return previuosCompromises
}