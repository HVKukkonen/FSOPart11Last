/* eslint
no-param-reassign: 0
no-underscore-dangle: 0
*/

// import mongoose
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// specify schema
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please, give username'],
    unique: [true, 'Username not unique'],
  },
  password: {
    type: String,
    required: [true, 'Please, give password'],
  },
  // role: 0 == admin, 1 == wisher, 2 == taker (Santa)
  role: { type: Number, required: [true, 'Every user needs a role'] },
  // links between wisher and takers
  linkedUsers: { type: mongoose.Schema.Types.ObjectId, ref: 'LinkedUser' },
  invitePass: { type: String },
  wish: { type: mongoose.Schema.Types.ObjectId, ref: 'Wish' },
});

userSchema.plugin(uniqueValidator);

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  },
});

module.exports = mongoose.model('User', userSchema);
