const passport              = require('passport');
const NodeGeocoder          = require('node-geocoder');
const nodemailer            = require('nodemailer');
const User                  = require('../database/models/user');
const Client                = require('../database/models/client');
const Elf                   = require('../database/models/elf');
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
      streetAddress: clientProps.streetAddress,
      suburb: clientProps.suburb,
      postCode: clientProps.postCode,
      state: clientProps.state,
    };

    const addressStr =
      add.streetAddress.trim()
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
        const geometry = {
          type: 'Point',
          coordinates: [latlong.long, latlong.lat]
        };
        console.log('got adress coords', latlong);
        add.coordinates = latlong;
        add.geometry = geometry;

        Client.create(clientProps)
          .then(client => {
            Client.findByIdAndUpdate({ _id: client._id })
              .then(theclient => {
                theclient.addresses.push(add);
                theclient.save()
                  .then(savedClient => {
                    user = savedClient;
                    sendNewClientEmail(savedClient.email);

                    const lat = savedClient.addresses[0].coordinates.lat;
                    const long = savedClient.addresses[0].coordinates.long;
                    console.log('latlng', lat, long);
                    console.log(typeof lat);
                    Elf.geoNear(
                      //{ type: 'Point', coordinates: [150.8903649, -34.4123691] },
                      { type: 'Point', coordinates: [parseFloat(long), parseFloat(lat)] },
                      { spherical: true, maxDistance: 10000 }
                    )
                      .then(elves => {
                        console.log('elves found', elves);
                        res.render('./signedUp', { user, elves });
                      })
                      .catch(err => {
                        console.log('something wrong with geo call');
                      });

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

  function sendNewClientEmail(email) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.zoho.com',
        port: 465, //587 for not secure
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'welcome@littleelf.io', // generated ethereal user
            pass: 'L1ttle3lf'  // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    const mailOptions = {
        from: '"Little Elf" <welcome@littleelf.io>', // sender address
        to: email, // list of receivers
        subject: 'Welcome ✔', // Subject line
        text: 'Hello from Little Elf!!! Thanks for signing up! \n Please note that this is an automated email - please do not reply', // plain text body
        html: '<b> Hello from Little Elf!!! Thanks for signing up! Please note that this is an automated email - please do not reply </b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('error occurred sending mail', error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
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
