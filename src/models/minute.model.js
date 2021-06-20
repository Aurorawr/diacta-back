const { Schema, model } = require('mongoose');

const dialogueElementSchema = new Schema({
    elementType: {
        type: String,
        enum: ['Duda', 'Compromiso', 'Acuerdo', 'Desacuerdo'],
        required: [true, "El tipo de un elemento del diálogo es obligatorio"],
    },
    enum: {
        type: Number,
        required: [true, "El enumerador de un elemento del diálogo es obligatorio"],
    },
    content: {
        type: String,
        required: [true, "El contenido de un elemento del diálogo es obligatorio"],
    }
},{
    timestamps: true,
});

const noteSchema = new Schema({
    content: {
        type: String,
        required: [true, "El contenido de una anotación es obligatorio"],
    }
},{
    timestamps: true,
});

const annexSchema = new Schema({
    url: {
        type: String,
        required: [true, "El link de un anexo es obligatorio"],
        ref: 'User'
    },
    name: {
        type: String,
        required: [true, "El nombre de un anexo es obligatorio"],
    }
},{
    timestamps: true,
});

const participantSchema = new Schema({
    participant: {
        type: Schema.Types.ObjectId,
        required: [true, "Un participante es obligatorio"],
    },
    confirmedAssistance: {
        type: Boolean,
        default: false,
    },
    assistance: {
        type: Boolean,
        default: false,
    }
},{
    timestamps: true,
});

const topicSchema = new Schema({
    enum: {
        type: Number,
        required: [true, "El enumerador de la acta es obligatorio"],
        unique: [true, "Ya existe un acta con este numerador"]
    },
    name: {
        type: String,
        required: [true, "El nombre de un tema en una acta es obligatorio"],
    },
    participants: [participantSchema],
    description: String,
    dialogueElements: [dialogueElementSchema],
    notes: [noteSchema]
},{
    timestamps: true,
});

const minuteSchema = new Schema({
    enum: {
        type: Number,
        required: [true, "El enumerador de la acta es obligatorio"],
        unique: [true, "Ya existe un acta con este numerador"]
    },
    description: String,
    place: String,
    date: Date,
    startTime: String,
    endTime: String,
    nextReunionDate: Date,
    topics: [topicSchema],
    annexes: [annexSchema]
},{
    timestamps: true,
});

module.exports = model('Minute', minuteSchema);