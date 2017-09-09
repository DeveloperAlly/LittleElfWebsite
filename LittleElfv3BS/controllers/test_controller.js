const accountSID    = 'AC429925663a39f1564b28fa6ef66f39f4';
const authToken     = '9c29ee308c64d834be38d1f9f5b16a11';
const smsclient     = require('twilio')(accountSID, authToken);
const Client        = require('../database/models/client');
const Elf           = require('../database/models/elf');
const User          = require('../database/models/user');
const Address       = require('../database/models/address');
const NodeGeocoder  = require('node-geocoder');
const nodemailer    = require('nodemailer');


module.exports = {
  showTestPage(req, res, next) {
    res.render('test.ejs');
  },

  sendTestSMS(req, res, next) {
    //Twilio number +61437894736
    //costs $6 per month
    const phone = '+61414684293';
    smsclient.messages.create({
        to: phone,
        from: '+61437894736',
        body: 'Hi Elf! You have a new job. Please log in to accept this job <3 from the Little Elf Team. \n Please do no reply',
    }, (err, message) => {
        if (err) {
          console.log('error', err);
        }
        console.log('sms sent', message.sid);
    });
  },

  findNearbyElves(req, res, next) {
    Client.findOne({ email: 'alihaire900@gmail.com' })
      .then(aclient => {
        console.log(aclient.addresses);
        const lat = aclient.addresses[0].coordinates.lat;
        const long = aclient.addresses[0].coordinates.long;
        console.log('latlng', lat, long);
        console.log(typeof lat);
        Elf.geoNear(
          //{ type: 'Point', coordinates: [150.8903649, -34.4123691] },
          { type: 'Point', coordinates: [parseFloat(long), parseFloat(lat)] },
          { spherical: true, maxDistance: 10000 }
        )
          .then(elves => {
            console.log('elves found', elves);
          })
          .catch(err => {
            console.log('something wrong with geo call');
          });
      })
      .catch(err => {
        console.log('couldnt find client');
      });

  },

  sendTestEmail(req, res, next) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    console.log('sendTestEmail');

    const email = 'alihaire900@gmail.com';
        // create reusable transporter object using the default SMTP transport
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
        let mailOptions = {
            from: '"Little Elf" <welcome@littleelf.io>', // sender address
            to: email, // list of receivers
            subject: 'Hello ✔', // Subject line
            text: 'Hello from Little Elf!!! - An automated email', // plain text body
            html: '<b>Hello world?</b>' // html body
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
  },

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
          results[0] = ({ firstName: 'none', address: {streetAddress: 'None'}});
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
