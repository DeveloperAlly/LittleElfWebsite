const passport              = require('passport');
const NodeGeocoder          = require('node-geocoder');
const User                  = require('../database/models/user');
const Client                = require('../database/models/client');
const Address               = require('../database/models/address');

module.exports = {

  /*******POST ROUTES*******/
  registerNewClient(req, res, next) {

    console.log('registernewClient: ', req.body);

    //check if user already registered
    User.findOne({ username: req.body.email })
      .then((auser) => {
        console.log(auser);
        if (auser !== null) {
          const user = req.body;
          const errors = [];
          const cerr = {
            param: 'userExists',
            msg: 'A user with the given email is already registered'
          };
          errors.push(cerr);
          return res.render('newClient.ejs', { errors, user });
        }
        User.register(new User({
            username  : req.body.email,
            type      : 'Client'
          }),
          req.body.password, (err, newuser) => {
            if (err) {
              console.log('***********error', err.name, err.message);
              const user = req.body;
              const errors = [];
              const cerr = {
                param: 'unknownError',
                msg: 'Unknown User Registration Error'
              };
              errors.push(cerr);
              return res.render('newClient.ejs', { errors, user });
            }
            passport.authenticate('local')(req, res, () => {
              console.log('registered a new user in db', req.body);
              chainedCreateClient(req.body, res, next);
            });
          });
      }) //end findone.then() function
      .catch((err) => {
        console.log('user.findone err', err);
      });
  },

  updateClientDetails(req, res) {
    console.log('updateClient: ', req.body);
  }

}; //END MODULE EXPORTS

  function chainedCreateClient(clientProps, res, next) {
    let errors = [];
    let user = clientProps;
    user.password = '';
    user.password2 = '';
    console.log('chained user', user);

    const add = {
      coordinates: '',
      unitNumber: clientProps.unitNumber,
      streetNumber: clientProps.streetNumber,
      streetName: clientProps.streetName,
      suburb: clientProps.suburb,
      postCode: clientProps.postCode,
      state: clientProps.state,
    };

    const addressStr = (add.streetNumber.trim())
      .concat(' ')
      .concat(add.streetName.trim())
      .concat(' ')
      .concat(add.suburb.trim())
      .concat(' Australia');

    const formattedAddressStr = addressStr.toLowerCase();
    console.log('getAddressCoordinates', formattedAddressStr);
    const options = {
      provider: 'google'
    };
    const geocoder = NodeGeocoder(options);

    geocoder.geocode(formattedAddressStr)
      .then((geocodeResult) => {
        console.log('adress coords', geocodeResult);
        const latlong = {
          lat:  geocodeResult[0].latitude,
          long: geocodeResult[0].longitude,
          googlePlaceId: geocodeResult[0].extra.googlePlaceId
        };
        console.log('got adress coords', latlong);
        add.coordinates = latlong;

        Client.create(clientProps)
          .then(client => {
            Client.findByIdAndUpdate({ _id: client._id })
              .then(theclient => {
                theclient.addresses.push(add);
                theclient.save()
                  .then(savedClient => {
                    user = savedClient;
                    res.render('./signedUp', { user });
                  })
                  .catch(saveclienterr => {
                    console.log('saveclienterr', saveclienterr);
                    errors = [];
                    const cerr = {
                      param: 'unknownError',
                      msg: 'Could not create new client'
                    };
                    errors.push(cerr);
                    chainedDeleteClient(clientProps.email);
                    return res.render('newClient.ejs', { errors, user });
                  });
              })
              .catch(updateclienterr => {
                console.log('updateclienterr', updateclienterr);
                errors = [];
                const cerr = {
                  param: 'unknownError',
                  msg: 'Could not create new client'
                };
                errors.push(cerr);
                chainedDeleteClient(clientProps.email);
                return res.render('newClient.ejs', { errors, user });
              });
          })
          .catch(clientcreateerr => {
            console.log('clientcreateerr', clientcreateerr);
            errors = [];
            const cerr = {
              param: 'unknownError',
              msg: 'Could not create new elf'
            };
            errors.push(cerr);
            deleteUser(clientProps.email);
            return res.render('newClient.ejs', { errors, user });
          });
      })
      .catch(geoerr => {
        console.log('address coords error', geoerr);
        errors = [];
        const cerr = {
          param: 'unknownError',
          msg: 'Could not create new client'
        };
        errors.push(cerr);
        deleteUser(clientProps.email);
        return res.render('newClient.ejs', { errors, user });
      });
  }

  //deletes client and user objects & render errors
  function chainedDeleteClient(username) {
    Client.findOneAndRemove({ email: username })
      .then(() => {
        console.log('remove client', username);
        User.findOneAndRemove({ username })
          .then(() => {
              console.log('remove user', username);
          })
          .catch(err => {
            console.log('delete client error', err);
          });
      })
      .catch(err => {
        console.log('delete username error', err);
      });
  }

  //delete user only
  function deleteUser(username) {
    User.findOneAndRemove({ username })
      .then(() => {
        console.log('user deleted');
        return;
      })
      .catch(err => {
        console.log('delete user error', err);
      });
  }

/*
  function createClient(clientProps) {
      Client.create(clientProps)
        .then(client => {
          console.log('new client created', client);
          createAddress(clientProps, client._id);
        })
        .catch(err => {
          console.log('create client error', err);
        }
      );
  }

  function createAddress(clientProps, clientId) {
    //get lat and long of address
    const add = {
      unitNumber: clientProps.unitNumber,
      streetNumber: clientProps.streetNumber,
      streetName: clientProps.streetName,
      suburb: clientProps.suburb,
      postCode: clientProps.postCode,
      state: clientProps.state,
    };
    Address.create(add)
      .then(address => {
          console.log('new address created', address);
          addAddressToClient(address, clientId);
      })
      .catch(err => { console.log('create address error', err); });
  }

  function addAddressToClient(addressObj, clientId) {
    Client.findByIdAndUpdate({ _id: clientId })
      .then(client => {
        client.addresses.push(addressObj);
        client.save()
          .then(savedClient => {
            console.log('update client address', savedClient.addresses);
          })
          .catch(err => { console.log('add address error', err); });
      })
      .catch(err => { console.log('add address error', err); });
  }

  function getAddressCoordinates(addressObj) {
    const addressStr = addressObj.streetNumber
      .concat(' ')
      .concat(addressObj.streetName)
      .concat(' ')
      .concat(addressObj.suburb)
      .concat(' Australia');

    const formattedAddressStr = addressStr.toLowerCase();
    console.log('getAddressCoordinates', formattedAddressStr);
    const options = {
      provider: 'google'
    };
    const geocoder = NodeGeocoder(options);

    geocoder.geocode(formattedAddressStr)
      .then((res) => {
        console.log('adress coords', res);
        const latlong = {
          lat:  res[0].latitude,
          long: res[0].longitude,
          googlePlaceId: res[0].extra.googlePlaceId
        };
        console.log('got adress coords', latlong);
      })
      .catch((err) => { console.log('address coords error', err); });
  }
*/
