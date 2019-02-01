const mongoose = require('mongoose');
const {Schema} = mongoose;
const emailValidator = require('email-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');

const usersSchema = new Schema({
  prenom: {
    type: String,
    required: true,
    minlength: 3,
  },
  nom: {
    type: String,
    required: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: emailValidator.validate,
      message: 'invalid_email'
    }
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  phone: {
    type: String,
    required: true,
    select: true,
    validate: {
      validator: (phone) => /\d{10}/.test(phone),
      message: 'invalid_phone',
    }
  },
  admin: {
    type: Boolean,
    default: false,
    select: true,
  },
  events: [{
    type: Schema.ObjectId,
    ref: 'Event',
  }]
});

usersSchema.methods = {
  authenticate: function(pass) {
    return bcrypt.compare(pass, this.password);
  },
  getToken: function() {
    return new Promise((resolve, reject) => {
      jwt.sign({id: this._id, username: this.username, admin: this.admin, exp: Date.now() + parseInt(config.jwt_expiration)}, config.jwt_encryption, (err, token) => {
        if(err)
          reject(err);
        else
          resolve(token);
      });
    });
  }
};

/**
 * 
 * @type {mongoose.Model}
 */
module.exports = mongoose.model('User', usersSchema);