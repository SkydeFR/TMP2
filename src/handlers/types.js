const express = require('express');
const router = express.Router();
const {Type} = require('../schema');

router.get('/get', (req, res) => {
  Type.find({}).exec()
    .then(types => res.status(200).json({code: 'success', types}))
    .catch(err => {
      console.error(err);
      res.status(500).json({code: 'internal_error'});
    });
});

module.exports = router;