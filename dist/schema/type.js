"use strict";

const mongoose = require('mongoose');

const {
  Schema
} = mongoose;
const typeSchema = new Schema({
  nom: {
    type: String,
    required: true,
    unique: true
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

module.exports = mongoose.model('Type', typeSchema);