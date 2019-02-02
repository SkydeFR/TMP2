"use strict";

const adduser = require('../util/adduser');

const util = require('util');

const read = require('read');

const mongooseconnect = require('../util/mongooseconnect');

function readInfo(prompt, silent = false) {
  const prom = util.promisify(read);
  return prom({
    silent,
    prompt
  });
}
/**
 * Script permettant l'ajout du premier administrateur dans la base de données.
 */


(async () => {
  try {
    console.log('Bienvenue dans le script d\'ajout d\'administrateur.');
    await mongooseconnect();
    const prenom = await readInfo('Prénom : ');
    const nom = await readInfo('Nom : ');
    const password = await readInfo('Mot de passe : ', true);
    const email = await readInfo('Adresse mail : ');
    const phone = await readInfo('Numéro de téléphone : ');

    try {
      const user = await adduser({
        prenom,
        nom,
        email,
        password,
        phone
      });
      user.admin = true;
      await user.save();
      console.log('Utilisateur ajouté.');
      process.exit(0);
    } catch (err) {
      console.log('Une erreur est survenue : ' + err.text);
      throw new Error('Saisies invalides');
    }
  } catch (e) {
    console.error('Une erreur est survenue', e);
  }
})();