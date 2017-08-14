const passport = require('passport');

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

}; //END modules.export
