const Client = require('../models/user');

/**
 * Finds a single artist in the artist collection.
 * @param {object} artistProps - Object containing a name, age, yearsActive, and genre
 * @return {promise} A promise that resolves with the Artist that was created
 */
module.exports = (clientProps) => {
  console.log(clientProps);
  const client = new Client(clientProps); //the variable is already an object
  return client.save();
};
