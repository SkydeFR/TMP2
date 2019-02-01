const express = require('express');
const router = express.Router();
const {Destination} = require('../schema');

router.get('/get', (req, res) => {
  Destination.find({}).populate('types').exec()
    .then(destinations => res.status(200).json({code: 'success', destinations}))
    .catch(err => {
      console.error(err);
      res.status(500).json({code: 'internal_error'});
    });
});

module.exports = router;