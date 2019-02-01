const express = require('express');
const router = express.Router();

// const {ObjectId} = require('mongoose').Types;

const {User, Type} = require('../schema');

const testadmin = require('../util/testadmin');

function verifAdminGet(req, res, next) {
  if(!req.query.token) {
    res.status(400).json({code: 'invalid_request'});
  }
  else {
    testadmin(req.query.token).then(() => {
      next();
    })
      .catch((err) => {
        res.status(err.httpcode).json({code: err.code});
      });
  }
}

function verifAdminPost(req, res, next) {
  if(!req.body.token) {
    res.status(400).json({code: 'invalid_request'});
  }
  else {
    testadmin(req.body.token).then(() => {
      next();
    })
      .catch((err) => {
        res.status(err.httpcode).json({code: err.code});
      });
  }
}

/**
 * Permet de convertir une chaîne de caractères en objet contenant les options avec leurs valeurs par défaut.
 * @return {Object}
 * @param {String} optionsEnter Options sous forme de chaînes de caractères envoyée à l'API. 
 * @param {Object} defaultOptions Options par défaut, sous la forme d'un objet.
 */
function stringToOptions(optionsEnter, defaultOptions) {
  const optionsString = optionsEnter ?? '{}';
  const optionsParam = JSON.parse(optionsString);
  const options = Object.assign(defaultOptions, optionsParam);

  return options;
}

router.get(verifAdminGet);

router.post(verifAdminPost);

router.get('/users/count', (req, res) => {
  console.log(req.query);
  const {status} = stringToOptions(req.query.options, {status: 'all'});
  const projection = (status === 'all') ? {} : (status === 'admin') ? {status: 'admin'} : {status : 'user'};
  User.countDocuments(projection, (err, result) => {
    if(err) {
      console.error(err);
      res.status(500).json({code: 'internal_error'});
    }
    else {
      res.status(200).json({code: 'success', users_count: result});
    }
  });
});

router.get('/users/list', (req, res) => {
  const {status} = stringToOptions(req.query.options, {
    status: 'all',
  });
  const projection = (status === 'all') ? {} : (status === 'admin') ? {status: 'admin'} : {status : 'user'};


  User.find(projection).exec((err, result) => {
    if(err) {
      console.error(err);
      res.status(500).json({code: 'internal_error'});
    }
    else {
      res.status(200).json({code: 'success', users: result});
    }
  });
});

router.post('/type/add', (req, res) => {
  if(!req.body.nom) {
    res.status(400).json({text: 'invalid_request'});
  }
  else {
    Type.findOne({nom: req.body.nom}).exec()
      .then(type => {
        if(type) {
          res.status(400).json({code: 'existing_type'});
        }
        else {
          const type = new Type({nom: req.body.nom});
          type.save()
            .then(type => {
              res.status(200).json({code: 'success', type});
            })
            .catch(err => {
              console.error(err);
              res.status(500).json({code: 'internal_error'});
            });
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({code: 'internal_error'});
      });
  }
});

router.post('/destination/add', (req, res) => {
  // if(!req.body.nom || !)
});

module.exports = router;