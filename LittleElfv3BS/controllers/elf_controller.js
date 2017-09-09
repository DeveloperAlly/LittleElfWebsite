const passport              = require('passport');
const NodeGeocoder          = require('node-geocoder');
const nodemailer            = require('nodemailer');
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
        console.log('auser', auser);
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
    streetAddress: elfProps.streetAddress,
    suburb: elfProps.suburb,
    postCode: elfProps.postCode,
    state: elfProps.state,
  };

  const addressStr = (
    add.streetAddress.trim()
    .concat(' ')
    .concat(add.suburb.trim())
    .concat(' Australia'));

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

      Elf.create(elfProps)
        .then(elf => {
          Elf.findByIdAndUpdate({ _id: elf._id })
            .then(theelf => {
              theelf.addresses.push(add);
              theelf.save()
                .then(savedElf => {
                  user = savedElf;
                  //                  res.render('./signedUp', { user });
                  res.render('./signedUp', { user });
                })
                .catch(saveelferr => {
                  console.log('saveelferr', saveelferr);
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
            .catch(updateelferr => {
              console.log('updateelferr', updateelferr);
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
        .catch(elfcreateerr => {
          console.log('elfcreateerr', elfcreateerr);
          errors = [];
          const cerr = {
            param: 'unknownError',
            msg: 'Could not create new elf'
          };
          errors.push(cerr);
          deleteUser(elfProps.email);
          return res.render('newElf.ejs', { errors, user });
        });
    })
    .catch(geoerr => {
      console.log('address coords error', geoerr);
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

function sendNewElfEmail(email) {
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
