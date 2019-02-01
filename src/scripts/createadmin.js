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

    const username = await readInfo('Nom d\'utilisateur : ');
    const password = await readInfo('Mot de passe : ', true);
    const email = await readInfo('Adresse mail : ');

    try {
      const user = await adduser({username, email, password, description: ''});
      user.status = 'admin';
      await user.save();
      console.log('Utilisateur ajouté.');
      return;
    }
    catch(err) {
      console.log('Une erreur est survenue : ' + err.text);
      throw new Error('Saisies invalides');
    }
  }
  catch(e) {
    console.error('Une erreur est survenue', e);
  }
})();