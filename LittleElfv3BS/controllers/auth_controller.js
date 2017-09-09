const passport = require('passport');
const crypto   = require('crypto');
const nodemailer = require('nodemailer');
//const smtpTransport = require('nodemailer-smtp-transport');
const User     = require('../database/models/user');

module.exports = {

login(req, res, next) {
  console.log('login', req.body);
/*  const user = {
    email: req.body.username
  }; */


  passport.authenticate('local', {
    successRedirect: res.redirect('/loggedIn'),
    failureRedirect: res.redirect('/login'),
  });
},

logout(req, res, next) {
    req.logout();
    console.log('you logged out');
    res.redirect('/');
},

showForgotPassword(req, res, next) {
  console.log('show forgot password', req.user);
  res.render('forgot.ejs', {
    errors: [{msg: 'hi'}],
    user: {email:''}
  });
},

forgotPassword(req, res, next) {
  const user = req.body;
  console.log('forgotPassword user req.body', user);
  let token = '';
  crypto.randomBytes(20, (err, buf) => {
      token = buf.toString('hex');
      console.log('token', token);
    });

  User.findOne({ username: user.email })
    .then((foundUser) => {
      foundUser.set({
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 3600000
      });
      foundUser.save()
        .then(() => {
          sendEmail(req, res, token, foundUser);
          console.log('foundUser1', foundUser);
        })
        .catch();
      console.log('foundUser', foundUser);
    })
    .catch(err => {
      const errors = [{ msg: 'Something went wrong.' }];
      return res.render('forgot.ejs', { user, errors });
    });
}


}; //END modules.export


function sendEmail(req, res, token, user) {
  console.log('email', user.username);

//  const nodemailer = require('nodemailer');

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
      service: 'Gmail',
      port: 465,
      secure: true, // secure:true for port 465, secure:false for port 587
      auth: {
        user: 'alihaire900@gmail.com',
        pass: 'Fr3ka2al!'
      }
  });

  // setup email data with unicode symbols
  const mailOptions = {
      from: '"Fred Foo 👻" <alihaire900@gmail.com>', // sender address
      to: 'anarchycharisma@gmail.com, ah900@uowmail.edu.au', // list of receivers
      subject: 'Hello ✔', // Subject line
      text: 'Hello world ?', // plain text body
      html: '<b>Hello world ?</b>' // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
  });
/*
  const smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'gmail',
        auth: {
          user: 'alihaire900@gmail.com',
          pass: 'Fr3ka2al!'
        }
      });

      const mailOptions = {
        to: 'anarchycharisma@gmail.com',
        from: 'alihaire900@gmail.com',
        subject: 'Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };

      smtpTransport.sendMail(mailOptions, (err) => {
        const errors = [{ param: 'emailsent', msg: 'An e-mail has been sent with further instructions.' }];
        return res.render('forgot.ejs', { user, errors });
    });
    */
}
