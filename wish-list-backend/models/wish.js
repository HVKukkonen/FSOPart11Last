/* eslint
no-param-reassign: 0
no-underscore-dangle: 0 */

// TITLE: MongoDB schema specification

// import mongoose
const mongoose = require('mongoose');

// specify schema for the mongoose wished item object
const wishSchema = mongoose.Schema({
  name: String,
  description: String,
  url: String,
  taken: Number,
  taker: { type: mongoose.Schema.Types.ObjectId, ref: 'Taker' },
  wisher: { type: mongoose.Schema.Types.ObjectId, ref: 'Wisher' },
});

// reformat returned object
wishSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

// export mongoose object based on specified schema
module.exports = mongoose.model('WishedItem', wishSchema);
