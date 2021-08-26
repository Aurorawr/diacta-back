const { Schema, model } = require('mongoose');

const taskSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: [true, "El encargado de la tarea es obligatorio"],
        ref: 'User'
    },
    compromise: {
        type: Schema.Types.ObjectId,
        required: [true, "El compromiso asociado a la tarea es obligatorio"],
        ref: 'DialogueElement'
    },
    state: {
        type: Number,
        default: 0
    },
    dueDate: Schema.Types.Date
},{
    timestamps: true,
});

module.exports = model('Task', taskSchema);