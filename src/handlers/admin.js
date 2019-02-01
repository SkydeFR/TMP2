const express = require('express');
const router = express.Router();
const _ = require('underscore');
const {isValid} = require('mongoose').Types.ObjectId;

// const {ObjectId} = require('mongoose').Types;

const {User, Type, Destination} = require('../schema');

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

router.post('/types/add', (req, res) => {
  if(!req.body.nom) {
    res.status(400).json({code: 'invalid_request'});
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

router.post('/destinations/add', (req, res) => {
  if(!req.body.lieu || !req.body.debut || !req.body.fin || !req.body.description || !req.body.types || !(req.body.types instanceof Array)) {
    res.status(400).json({code: 'invalid_request'});
  }
  else {
    const debut = Date.parse(req.body.debut);
    const fin = Date.parse(req.body.fin);
    if(!debut) {
      res.status(400).json({code: 'invalid_start_date'});
    }
    else if(!fin) {
      res.status(400).json({code: 'invalid_end_date'});
    }
    else {
      Destination.findOne({lieu: req.body.lieu}).exec()
        .then(async lieu => {
          if(lieu) {
            res.status(400).json({code: 'existing_place'});
          }
          else {
            if((_.filter(req.body.types, (element) => !isValid(element))).length !== 0) {
              res.status(400).json({code: 'invalid_type_ids'});
            }
            else {
              try {
                const listeTypes = await Promise.all(req.body.types.map(id => Type.findById(id).exec()));
                if(listeTypes.length < req.body.types.length) {
                  res.status(400).json({code: 'invalid_type_ids'});
                }
                else {
                  const destination = new Destination({debut, fin, lieu: req.body.lieu, description: req.body.description, types: req.body.types});
                  destination.save()
                    .then(async destination => {
                      await Promise.all(listeTypes.map(type => {
                        type.destinations.push(destination._id);
                        return type.save();
                      }));
                      res.status(200).json({code: 'success', destination});
                    })
                    .catch(err => {
                      console.error(err);
                      res.status(500).json({code: 'internal_error'});
                    });
                }
              }
              catch(err) {
                console.error(err);
                res.status(500).json({code: 'internal_error'});
              }
            }
          }
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({code: 'internal_error'});
        });
    }
  }
});

module.exports = router;