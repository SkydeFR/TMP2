/**
 * @type {Model}
 */
const {User} = require('../schema');
const readline = require('readline');
const mongooseconnect = require('../util/mongooseconnect');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});




rl.question('Êtes-vous sûr de vouloir vider la base de données ? [y/N] ', (answer) => {
  if(answer.toUpperCase() === 'Y') {
    console.log('Suppression en cours...');
    mongooseconnect()
      .then(() => {
        User.deleteMany({}, (err) => {
          if(err)
            console.error('An error occured during users cleaning : ', err);
          else {
            console.log('La base de données a été vidée.');
            rl.close();
            process.exit(0);
          }
        });
      })
      .catch((err) => {
        console.error('An error occured during MongoDB connection : ', err);
      });
  }
  else {
    console.log('Aucune modification n\'a été effectuée.');
  }
});