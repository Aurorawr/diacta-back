const { Schema, model } = require('mongoose');

const references = {
    minuteEnum: {
        type: Number,
        required: true
    },
    topicEnum: {
        type: Number,
        required: true
    },
}

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
    },
    references: references
},{
    timestamps: true,
});

module.exports = model('DialogueElement', dialogueElementSchema);