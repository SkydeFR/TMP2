const mongoose = require('mongoose');
const {Schema} = mongoose;

const destinationSchema = new Schema({
  debut: {
    type: Date,
    required: true,
  },
  fin: {
    type: Date,
    required: true,
  },
  lieu: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: false,
  },
  events: [{
    type: Schema.ObjectId,
    ref: 'Event',
  }],
  types: [{
    type: Schema.ObjectId,
    ref: 'Type',
    required: false,
  }],
  nature: {
    type: String,
    required: true,
    enum: ['temps', 'espace'],
    default: 'temps',
  }
});

/**
 * 
 * @type {mongoose.Model}
 */
module.exports = mongoose.model('Destination', destinationSchema);