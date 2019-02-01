const mongoose = require('mongoose');
const {Schema} = mongoose;

const eventSchema = new Schema({
  debut: {
    type: Date,
    required: true,
  },
  destination: {
    type: Schema.ObjectId,
    required: true,
    ref: 'Destination',
  },
  utilisateur: {
    type: Schema.ObjectId,
    required: true,
    ref: 'User',
  },
  type: {
    type: Schema.ObjectId,
    required: true,
    ref: 'Type',
  }
});

/**
 * 
 * @type {mongoose.Model}
 */
module.exports = mongoose.model('Event', eventSchema);