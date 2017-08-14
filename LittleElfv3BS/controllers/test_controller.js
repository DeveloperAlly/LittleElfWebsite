const Client        = require('../database/models/client');
const Elf           = require('../database/models/elf');
const User          = require('../database/models/user');
const Address       = require('../database/models/address');
const NodeGeocoder  = require('node-geocoder');


module.exports = {
  showTest(req, res, next) {
    const user = req.body;
    const errors = [];
    let results = [];
    res.render('testdb.ejs', {errors, results, user});
  },

  editUser(req, res, next) {

  },

  findByEmail(req, res, next) {
    console.log('find by email page', req.body);
    let user = req.body;
    let errors = [];
    let results = [];

    getAddressCoordinates();

    if (user===null) {
      return
    }

    User.findOne({ username: req.body.email1 })
      .then((auser) => {
        results.push(auser);
        console.log('user deets:', auser);
        const email = auser.username;
        if (auser.type === 'Client') {
          Client.findOne({ email })
            .then((aclient) => {
              results[0] = aclient;
              res.render('testdb.ejs', {errors, results, user });
            })
            .catch((err) => { console.log('client.findOne catch block', err); });
        } else if (auser.type === 'Elf') {
          Elf.findOne({ email })
            .then((anelf) => {
              results[0] = anelf;
              res.render('testdb.ejs', {errors, results, user });
            })
            .catch((err) => { console.log('elf.findOne catch block', err); });
        }
      })
      .catch((err) => {
          console.log('errrr', err);
          errors.push({ msg: 'No user by this email found' });
          results[0] = ({ firstName: 'none', address: {streetName: 'None'}});
          res.render('testdb.ejs', {errors, results, user });
      });
  },

  findByEmailAndDelete(req, res, next) {
    console.log('find by email and delelte page', req.body);
    let user = req.body;
    let errors = [];
    let results = [];

    User.findOne({ username: req.body.email2})
      .then((auser) => {
        chainedDelete(auser);
      })
      .catch((err) => {
        console.log('no user found', err);
        errors.push({ msg: 'No user by this email found' });
      });

      res.render('testdb.ejs', {errors, results, user });
  } //end findByEmailAndDelete function
}; //end exports

function getAddressCoordinates() {
  const options = {
    provider: 'google'
  };
  const geocoder = NodeGeocoder(options);
  //2500,WOLLONGONG,NSW,-34:26:18,-150:53:09
  geocoder.geocode('1 northfields avenue wollongong')
    .then((res) => {
      console.log('adress coords', res);
    })
    .catch((err) => { console.log('address coords error', err); });
}

function chainedDelete(user) {
  const email = user.username;

  /**Client case **/
  if (user.type === 'Client') {
    Client.findOne({ email })
      .then((aclient) => {
        console.log('aclient', aclient);
        Address.findByIdAndRemove({ _id: aclient.address[0]._id})
          .then(() => {
            console.log('removed address');
            Client.findByIdAndRemove({ _id: aclient._id })
              .then(() => {
                console.log('removed client');
                User.findByIdAndRemove({ _id: user._id })
                  .then(() => {
                    console.log('user has been thoroughly removed.');
                  })
                  .catch((err) => { console.log('remove user catch block'); })
              })
              .catch((err) => { console.log('remove client catch block'); })
          })
          .catch((err) => { console.log('address catch block'); });
      })
      .catch((err) => { console.log('client findone catch block'); }); ///error

  } else if (user.type === 'Elf') {
    console.log('its an elf');
  } //end elf case
}
