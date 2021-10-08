const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "El nombre del usuario es requerido"],
  },
  lastname: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "El email del usuario es requerido"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "La contraseña del usuario es requerida"],
  },
  cellphone: String,
  isAdmin: {
    type: Boolean,
    default: false
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  reminders: [{ type: Schema.Types.ObjectId, ref: 'Reminder' }]
},{
  timestamps: true,
});

userSchema.statics.findByEmail = function(email) {
  return this.find({email});
}

userSchema.method('toJSON', function() {
  const user = this.toObject();
  delete user.password;
  delete user.reminders;
  delete user.createdAt;
  delete user.updatedAt;
  delete user.__v;

  return user;
})

module.exports = model('User', userSchema);