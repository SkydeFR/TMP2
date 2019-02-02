const express = require('express');
const router = express.Router();
const _ = require('underscore');
const {isValid} = require('mongoose').Types.ObjectId;
const stringToOptions = require('../util/stringtooptions');

// const {ObjectId} = require('mongoose').Types;

const {User, Type, Destination} = require('../schema');

const testadmin = require('../util/testadmin');

/**
 * TOUTES LES FONCTIONS ADMIN NÉCESSITENT DE PASSER UN PARAMÈTRE TOKEN CONTENANT LE TOKEN DE L'USER.
 */

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

router.get(verifAdminGet);

router.post(verifAdminPost);

/**
 * Permet de compter les utilisateurs.
 * Paramètres :
 * options (facultatif) : objet contenant un attribut 'status', contenant soit 'admin', soit 'all', soit 'users', en fonction de ce que l'on veut compter (défaut : 'all')
 */
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

/**
 * Permet de lister les utilisateurs.
 * Paramètres :
 * options (facultatif) : objet contenant un attribut 'status', contenant soit 'admin', soit 'all', soit 'users', en fonction de ce que l'on veut lister (défaut : 'all')
 */
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

/**
 * Permet d'ajouter un type
 * Paramètres :
 * nom : String : nom du type.
 */
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

router.post('/types/edit', async (req, res) => {
  if(!req.body.nom || !req.body.id) {
    res.status(400).json({code: 'invalid_request'});
  }
  else if(!isValid(req.body.id)){
    res.status(400).json({code: 'invalid_id'});
  }
  else {
    try {
      const type = await Type.findByIdAndUpdate(req.body.id, {nom: req.body.nom}).exec();
      if(type) {
        res.status(200).json({code: 'success', type});
      }
      else {
        res.status(404).json({code: 'type_not_found'});
      }
    }
    catch(error) {
      console.error(error);
      res.status(500).json({code: 'internal_error'});
    }
  }
});

router.post('/types/delete',  async (req, res) => {
  if(!req.body.id) {
    res.status(400).json({code: 'invalid_request'});
  }
  else if(!isValid(req.body.id)) {
    res.status(400).json({code: 'invalid_id'});
  }
  else {
    try {
      const type = await Type.findByIdAndDelete(req.body.id).exec();
      if(type) {
        res.status(200).json({code: 'success'});
      }
      else {
        res.status(404).json({code: 'type_not_found'});
      }
    }
    catch(error) {
      console.error(error);
      res.status(500).json({code: 'internal_error'});
    }
  }
})

/**
 * Permet d'ajouter une destination
 * Paramètres :
 * lieu : String : Nom du lieu
 * debut : Date ISO (String) : Date de début dans l'histoire
 * fin : Date ISO (String) : Date de fin dans l'histoire
 * types : Tableau des IDs de types compatibles
 */
router.post('/destinations/add', (req, res) => {
  if(!req.body.lieu || !req.body.debut || !req.body.fin || !req.body.description || !req.body.nature || !['temps', 'espace'].includes(req.body.nature) || req.body.nature === 'temps' && !(req.body.types instanceof Array)) {
    res.status(400).json({code: 'invalid_request'});
  }
  else {
    const modeTemps = (req.body.nature === 'temps');
    const debut = Date.parse(req.body.debut);
    const fin = Date.parse(req.body.fin);
    if(!debut) {
      res.status(400).json({code: 'invalid_start_date'});
    }
    else if(!fin) {
      res.status(400).json({code: 'invalid_end_date'});
    }
    else if(debut > fin) {
      res.status(400).json({code: 'end_before_start'});
    }
    else {
      Destination.findOne({lieu: req.body.lieu}).exec()
        .then(async lieu => {
          if(lieu) {
            res.status(400).json({code: 'existing_place'});
          }
          else if(modeTemps) {
            if(modeTemps && (_.filter(req.body.types, (element) => !isValid(element))).length !== 0) {
              res.status(400).json({code: 'invalid_type_ids'});
            }
            else {
              try {
                const listeTypes = await Promise.all(req.body.types.map(id => Type.findById(id).exec()));
                if(listeTypes.length < req.body.types.length) {
                  res.status(400).json({code: 'invalid_type_ids'});
                }
                else {
                  const destination = new Destination({debut, fin, lieu: req.body.lieu, description: req.body.description, types: req.body.types, nature: req.body.nature});
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
          else {
            const destination = new Destination({debut, fin, lieu: req.body.lieu, description: req.body.description, nature: req.body.nature});
            destination.save()
              .then(destination => {
                res.status(200).json({code: 'success', destination});
              })
              .catch(err => {
                console.error(err);
                res.status(500).json({code:'internal_error'});
              });
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