const { Schema, model } = require('mongoose');

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
    },
    description: String
},{
    timestamps: true,
});

const participantSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: [true, "Un participante es obligatorio"],
        ref: 'User'
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
        required: [true, "El enumerador de la acta es obligatorio"]
    },
    name: {
        type: String,
        required: [true, "El nombre de un tema en una acta es obligatorio"],
    },
    description: String,
    dialogueElements: [{ type: Schema.Types.ObjectId, ref: 'DialogueElement' }],
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
    header: String,
    description: String,
    participants: [participantSchema],
    previousCompromises: [{ type: Schema.Types.ObjectId, ref: 'DialogueElement' }],
    place: String,
    date: Date,
    startTime: String,
    endTime: String,
    nextReunionDate: Date,
    topics: [topicSchema],
    annexes: [annexSchema],
    phase: {
        type: Number,
        enum: [1, 2, 3],
        default: 1
    }
},{
    timestamps: true,
});

minuteSchema.method('toJSON', function() {
    const minute = this.toObject();
    delete minute.createdAt;
    delete minute.updatedAt;
    delete minute.__v;
  
    return minute;
  })

module.exports = model('Minute', minuteSchema);