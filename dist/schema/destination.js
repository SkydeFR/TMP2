"use strict";

const mongoose = require('mongoose');

const {
  Schema
} = mongoose;
const destinationSchema = new Schema({
  debut: {
    type: Date,
    required: true
  },
  fin: {
    type: Date,
    required: true
  },
  lieu: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  events: [{
    type: Schema.ObjectId,
    ref: 'Event'
  }]
});
/**
 * 
 * @type {mongoose.Model}
 */

module.exports = mongoose.model('Destination', destinationSchema);