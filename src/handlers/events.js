'use strict';

const express = require('express');
const router = express.Router();
const {ObjectId} = require('mongoose').Types;
const {isValid} = ObjectId;
const {Type, Destination, Event, User} = require('../schema');
const testtoken = require('../util/testtoken');

router.post('/add', (req, res) => {
  if(!req.body.token || !req.body.date || !req.body.type || !req.body.destination || !isValid(req.body.type) || !isValid(req.body.destination)) {
    res.status(400).json({code: 'invalid_request'});
  }
  else {
    const {token} = req.body;
    testtoken(token)
      .then(async (user) => {
        try {
          const type = await Type.findById(req.body.type);
          if(!type) {
            res.status(404).json({code: 'unknown_type'});
          }
          else {
            const destination = await Destination.findById(req.body.destination);
            if(!destination) {
              res.status(404).json({code: 'unknown_destination'});
            }
            else {
              const types = destination.types.map((elt) => elt.toString());
              if(types.includes(req.body.type)) {
                if(Date.parse(req.body.date)) {
                  const event = new Event({
                    debut: req.body.date,
                    user: user.id,
                    type: type._id,
                    destination: destination._id,
                  });

                  try {
                    const savedevent = await event.save();
                    const {user, type, destination} = savedevent;
                    const userFull = await User.findByIdAndUpdate(user, {
                      $push: {events: savedevent._id}
                    });
                    const typeFull = await Type.findByIdAndUpdate(type, {
                      $push: {events: savedevent._id}
                    });
                    const destinationFull = await Destination.findByIdAndUpdate(destination, {
                      $push: {events: savedevent._id}
                    });
                    res.status(200).json({code: 'success', event: savedevent});
                  }
                  catch(err) {
                    console.error(err);
                    res.status(500).json({code: 'internal_error'});
                  }
                }
                else {
                  res.status(400).json({code: 'invalid_date'});
                }
              }
              else {
                console.log(req.body.type);
                console.log(types);
                console.log(types.includes(req.body.type));
                res.status(400).json({code: 'incompatible_type'});
              }
            }
          }
        }
        catch(error) {
          console.error(error);
          res.status(500).json({code: 'internal_error'});
        }
      })
      .catch(() => {
        res.status(403).json({code: 'invalid_token'});
      });
  }
});

module.exports = router;