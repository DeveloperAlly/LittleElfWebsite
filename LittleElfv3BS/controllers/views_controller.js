//TODO: Move db functions to queries folder/files
//TODO: Create helper functions for logic, remove from code

const passport              = require('passport');
const NodeGeocoder          = require('node-geocoder');
const User                  = require('../database/models/user');
const Client                = require('../database/models/client');
const Elf                   = require('../database/models/elf');

const options = {
  provider: 'google'
};

const geocoder = NodeGeocoder(options);

module.exports = {

  /*******RENDER PAGES*******/
  showLanding(req, res, next) {
    res.render('home.ejs');
  },
  showLogin(req, res, next) {
    const user = {email: ''};
    const errors = [{ msg: 'hi'}];
    res.render('login.ejs', { user, errors });
  },
  showNewClient(req, res, next) {
    const errors = [];
    console.log(errors.length);
    const user = { };
    res.render('newClient.ejs', { errors, user });
  },
  showNewElf(req, res, next) {
    const errors = [];
    console.log(errors.length);
    const user = { };
    res.render('newElf.ejs', { errors, user });
  },
  showLoggedIn(req, res, next) {
    console.log('show logged up', req.user);
    if (req.user.type === 'Client') {
      Client.findOne({ email: req.user.username }, (err, user) => {
        if (err) {
          console.log('err in showSignedUp', err);
        } else {
          console.log('signed up client:', user);
          res.render('loggedIn.ejs', { user });
        }
      });
    } else if (req.user.type === 'Elf') {
      Elf.findOne({ email: req.user.username }, (err, user) => {
        if (err) {
          console.log('err in loggedin', err);
        } else {
          console.log('logged in:', user);
          res.render('loggedIn.ejs', { user });
        }
      });
    } else {
      console.log('im an admin or an error');
      res.render('error.ejs');
    }
  },
  showSignedUp(req, res, next) {
    console.log('show signed up', req.user);
    if (req.user.type === 'Client') {
      Client.findOne({ email: req.user.username }, (err, user) => {
        if (err) {
          console.log('err in showSignedUp', err);
        } else {
          console.log('signed up client:', user);
          res.render('signedUp.ejs', { user });
        }
      });
    } else if (req.user.type === 'Elf') {
      Elf.findOne({ email: req.user.username }, (err, user) => {
        if (err) {
          console.log('err in showSignedUp', err);
        } else {
          console.log('signed up elf:', user);
          res.render('signedUp.ejs', { user });
        }
      });
    } else {
      console.log('im an admin or an error');
      res.render('error.ejs');
    }
  },

  showRegister(req, res, next) {
    const errors = [{ msg:'', }];
    console.log(errors);
    const user = {};
    res.render('newClient.ejs', { errors, user });
  },
  showErrorPage(req, res, next) {
    res.render('error.ejs');
  },

  /*******LOGIN/OUT PAGES*******/
  loginUser(err, req, res, next) {
    console.log('user loggedIn', req);
  },
  logoutUser(req, res)  {
    req.logout(); //destroy session user data
    res.redirect('/');
  },

  /*******USER PAGES*******/
  showUserDetails(req, res, next) {
    const errors = [];
    console.log('showUserDetails', req.user);
    if (req.user.type === 'Client') {
      Client.findOne({ email: req.user.username }, (err, user) => {
        if (err) {
          console.log('err in userdetails', err);
        } else {
          console.log('userdetails:', user);
          res.render('userDetails.ejs', { user, errors });
        }
      });
    } else if (req.user.type === 'Elf') {
      Elf.findOne({ email: req.user.username }, (err, user) => {
        if (err) {
          console.log('err in userdetails', err);
        } else {
          console.log('userdetails:', user);
          res.render('userDetails.ejs', { user, errors });
        }
      });
    } else {
      console.log('im an admin or an error');
      res.render('error.ejs');
    }
  },

  /*******JOB PAGES*******/
  showNewJob(req, res, next) {
    if (req.user.type === 'Client') {
      Client.findOne({ email: req.user.username })
        .then((user) => {
          //console.log('newjob user', user.address[0].streetName);
          const errors = [];
          res.render('newJob.ejs', { user, errors });
        })
        .catch((err) => { console.log('client findone catcherror ', err); });
    }
  },
  showJobs(req, res, next) {
    res.render('showJobs.ejs');
  },

}; //END MODULE EXPORTS
