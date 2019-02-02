const express = require('express');
const router = express.Router();
const {Destination} = require('../schema');
const stringToOptions = require('../util/stringtooptions');

/**
 * Liste les destinations. Prend possiblement des options en paramètre, formatées en json.
 * Options:
 * nature (Array), contenant les types demandés ('temps' et 'espace'). Par défaut, ['temps', 'espace']
 */
router.get('/get', (req, res) => {
  const options = stringToOptions(req.query.options, {
    nature: ['temps', 'espace'],
  });
  Destination.find({nature: {$in: options.natue}}).populate('types').exec()
    .then(destinations => res.status(200).json({code: 'success', destinations}))
    .catch(err => {
      console.error(err);
      res.status(500).json({code: 'internal_error'});
    });
});

module.exports = router;