'use strict';

const express = require('express');
const router = express.Router();
const {isValid} = require('mongoose').Types.ObjectId;
const {Type, Destination, Event} = require('../schema');
const testtoken = require('../util/testtoken');

router.post('/create', (req, res) => {
  if(!req.body.token || !req.body.date || !req.body.type || !req.body.destination || isValid(req.body.type) || isValid(req.body.destination)) {
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
              if(Date.parse(req.body.date)) {
                const event = new Event({
                  date: req.body.date,
                  user: user._id,
                  type: type._id,
                  destination: destination._id,
                });

                event.save()
                  .then(event => res.status(200).json({code: 'success', event}))
                  .catch(error => {
                    console.error(error);
                    res.status(500).json({code: 'internal_error'});
                  })
              }
              else {
                res.status(400).json({code: 'invalid_date'});
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