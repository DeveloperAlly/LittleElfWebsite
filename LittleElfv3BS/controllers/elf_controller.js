const passport              = require('passport');
const NodeGeocoder          = require('node-geocoder');
const User                  = require('../database/models/user');
const Elf                   = require('../database/models/elf');
const Address               = require('../database/models/address');

module.exports = {
  /*******POST ROUTES*******/
  registerNewElf(req, res) {

    console.log('registernewElf: ', req.body);

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
          return res.render('newElf.ejs', { errors, user });
        }
        User.register(new User({
            username  : req.body.email,
            type      : 'Elf'
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
              return res.render('newElf.ejs', { errors, user });
            }
            passport.authenticate('local')(req, res, () => {
              console.log('registered a new user in db', req.body);
              chainedCreateElf(req.body, res);
            });
          });
      }) //end findone.then() function
      .catch((err) => {
        console.log('user.findone err', err);
      });
  },

  updateElfDetails(req, res) {
    console.log('updateElf: ', req.body);
  }


}; //END MODULE EXPORTS

function chainedCreateElf(elfProps, res, next) {
  let errors = [];
  let user = elfProps;
  user.password = '';
  user.password2 = '';
  console.log('chained user', user);

  const add = {
    coordinates: '',
    unitNumber: elfProps.unitNumber,
    streetNumber: elfProps.streetNumber,
    streetName: elfProps.streetName,
    suburb: elfProps.suburb,
    postCode: elfProps.postCode,
    state: elfProps.state,
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

      Elf.create(elfProps)
        .then(elf => {
          console.log('new elf created', elf);
          Address.create(add)
            .then(addressObj => {
                console.log('new address created', addressObj);
                const elfId = elf._id;
                Elf.findByIdAndUpdate({ _id: elfId })
                  .then(theelf => {
                    theelf.addresses.push(addressObj);
                    theelf.save()
                      .then(savedElf => {
                        console.log('update elf address', savedElf.addresses);
                        user = savedElf;
                        res.render('./signedUp', { user });
                      })
                      .catch(err => {
                        //delete address, elf & user, update elf failed
                        console.log('add address error', err);
                        errors = [];
                        const cerr = {
                          param: 'unknownError',
                          msg: 'Could not create new elf'
                        };
                        errors.push(cerr);
                        chainedDeleteElfAndAddresses(elfProps.email);
                        return res.render('newElf.ejs', { errors, user });
                      });
                  })
                  .catch(err => {
                    //delete address, user & elf, find elf error
                    console.log('find elf add address error', err);
                    errors = [];
                    const cerr = {
                      param: 'unknownError',
                      msg: 'Could not create new elf'
                    };
                    errors.push(cerr);
                    chainedDeleteElfAndAddresses(elfProps.email);
                    return res.render('newElf.ejs', { errors, user });
                  });
            })
            .catch(err => {
              //delete user & elf - address create error
              console.log('create address error', err);
              errors = [];
              const cerr = {
                param: 'unknownError',
                msg: 'Could not create new elf'
              };
              errors.push(cerr);
              chainedDeleteElf(elfProps.email);
              return res.render('newElf.ejs', { errors, user });
            });
        })
        .catch(err => {
          //delete user only elf create error
          console.log('create elf error', err);
          errors = [];
          const cerr = {
            param: 'unknownError',
            msg: 'Could not create new elf'
          };
          errors.push(cerr);
          deleteUser(elfProps.email);
          return res.render('newElf.ejs', { errors, user });
        }
      );

    })
    .catch((errorg) => {
      //delete user only - this is geocoords error
      console.log('address coords error', errorg);
      errors = [];
      const cerr = {
        param: 'unknownError',
        msg: 'Could not create new elf'
      };
      errors.push(cerr);
      deleteUser(elfProps.email);
      return res.render('newElf.ejs', { errors, user });
    });
}

//deletes elf and user objects & render errors
function chainedDeleteElf(username) {
  //get elf and delete
  //get user & delete
  Elf.findOneAndRemove({ email: username })
    .then(() => {
      console.log('remove elf', username);
      User.findOneAndRemove({ username })
        .then(() => {
            console.log('remove user', username);
        })
        .catch(err => {
          console.log('delete elf error', err);
        });
    })
    .catch(err => {
      console.log('delete username error', err);
    });
}

//delete user only & render errors
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

function getAddressCoordinates(addressStr) {
console.log('getAddressCoordinates', addressStr.toLowerCase());
const formattedAddressStr = addressStr.toLowerCase();
const options = {
  provider: 'google'
};
const geocoder = NodeGeocoder(options);
//2500,WOLLONGONG,NSW,-34:26:18,-150:53:09
geocoder.geocode(formattedAddressStr)
  .then((res) => {
    console.log('address coords', res);
    return res[0];
  })
  .catch((err) => { console.log('address coords error', err); return -1; });
}
