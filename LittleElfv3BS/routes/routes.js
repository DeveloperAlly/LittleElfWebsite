
const passport              = require('passport');
const ViewsController       = require('../controllers/views_controller');
const ClientController      = require('../controllers/client_controller');
const ElfController         = require('../controllers/elf_controller');
const JobController         = require('../controllers/job_controller');
const AuthController        = require('../controllers/auth_controller');
const TestController        = require('../controllers/test_controller');
const validate              = require('../public/scripts/form_validator');

module.exports = (app) => {

  /***********API TEST PAGE***********/
  app.get('/test', TestController.showTest);
  app.post('/findUserByEmail', TestController.findByEmail);
  app.post('/findUserByEmailAndDelete', TestController.findByEmailAndDelete);


  /*******RENDER PAGES*******/
  app.get('/', ViewsController.showLanding);
  app.get('/clients/new', ViewsController.showNewClient);
  app.get('/elves/new', ViewsController.showNewElf);
  app.get('/login', ViewsController.showLogin);
  app.get('/logout', ViewsController.logoutUser);
  app.get('/loggedIn', isLoggedIn, ViewsController.showLoggedIn);
  app.get('/signedUp', isLoggedIn, ViewsController.showSignedUp);

  app.get('/jobs/new', isLoggedIn, ViewsController.showNewJob); //TODO: isloggedin check
  app.get('/jobs/show', isLoggedIn, ViewsController.showJobs);

  app.get('/user/details', isLoggedIn, ViewsController.showUserDetails);

  /*******POSTS PAGES*******/
  app.post('/login',
    passport.authenticate('local',
      {
        successRedirect: '/loggedIn',
        failWithError: true
      }),
    (err, req, res, next) => {
      const user = {email: req.body.email};
      const errors = [{ msg: 'Invalid Email or Password'}];
      return res.render('login.ejs', { user, errors });
  });

  app.post('/registerNewClient', validate.validateClientFormInput1, ClientController.registerNewClient);
  app.post('/registerNewElf', validate.validateClientFormInput1, ElfController.registerNewElf);
  app.post('/createNewJob', JobController.createNewJob);
  app.post('./user/details/updateClient', validate.validateUpdateForm, ClientController.updateClientDetails);
  app.post('./user/details/updateElf', validate.validateUpdateForm, ElfController.updateElfDetails);

  app.get('*', ViewsController.showErrorPage);

};//end module.exports

/*******MIDDLEWARE*******/
//TODO: move these to a separate file
function isLoggedIn(req, res, next) {
  console.log('authenticate', req);
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

function authenticate(req, res, next) {
  console.log('req', req.body);
  const user = {
    email: req.body.email
  };
  const errors = [{msg:''}, {
    msg: 'Invalid email or password'
  }];
  passport.authenticate('local', {
    successRedirect: ('/loggedIn'),
    failureRedirect: ('/login', { user, errors }),
    failureFlash: true
  });
}
