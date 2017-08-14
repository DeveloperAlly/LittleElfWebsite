const passport = require('passport');
//Import any needed database models here
//const Client = require('./database/models/client');

//import any .ejs here???

module.exports = {

showLandingPage(req, res, next) {
  res.render('./landing.ejs');
},

showLoginPage(req, res, next) {
  res.render('./login.ejs');
},

showGenericSignupPage(req, res, next) {
  res.render('./signup.ejs');
},

showCongratsPage(req, res, next) {
  console.log('congrats', req.isAuthenticated);
  res.render('./congrats.ejs');
},

showLoggedInPage(req, res, next) {
  console.log('logged in');
  res.render('./loggedIn');
},


}; //END modules.export


//middleware functions
