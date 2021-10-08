const { Schema, model } = require('mongoose');

const schemaOptions = {
    timestamps: true,
    discriminatorKey: 'kind'
}

const reminderSchema = new Schema({
    event: {
        type: String,
        enum: ['Reunión', 'Tareas', 'Personalizado'],
        required: [true, 'El tipo de evento de un recordatorio es obligatorio']
    },
    when: {
        second: {
            type: Number,
            default: 0
        },
        minute: {
            type: Number,
            default: 0
        },
        hour: {
            type: Number,
            default: 0
        },
        date: {
            type: Number,
            default: 0
        },
        month: {
            type: Number,
            default: 0
        },
        year: {
            type: Number,
            default: 0
        },
        dayOfWeek: {
            type: Number,
            default: 0
        },
        tz: {
            type: String,
            default: 'America/Santiago'
        },
    },
    vias: {
        type: [String],
        enum: ['Email', 'SMS'],
        required: [true, "Debe ingresar al menos un medio para el recordatorio"]
    },
    message: String
}, schemaOptions)

reminderSchema.method('toJSON', function() {
    const reminder = this.toObject();
    delete reminder.createdAt;
    delete reminder.updatedAt;
    delete reminder.__v;
  
    return reminder;
  })

module.exports = model('Reminder', reminderSchema)