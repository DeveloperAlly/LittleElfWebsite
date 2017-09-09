
const passport              = require('passport');
const ViewsController       = require('../controllers/views_controller');
const ClientController      = require('../controllers/client_controller');
const ElfController         = require('../controllers/elf_controller');
const JobController         = require('../controllers/job_controller');
const AuthController        = require('../controllers/auth_controller');
const UserController        = require('../controllers/user_controller');
const TestController        = require('../controllers/test_controller');
const validate              = require('../public/scripts/form_validator');

module.exports = (app) => {

  /***********API TEST PAGE***********/
  //app.post('/findUserByEmail', TestController.findByEmail);
  //app.post('/findUserByEmailAndDelete', TestController.findByEmailAndDelete);
  //test_controller

  app.get('/test', TestController.showTestPage);
  app.post('/test/email', TestController.sendTestEmail);
  app.post('/test/phone', TestController.sendTestSMS);
  app.post('/test/findElves', TestController.findNearbyElves);

  /*******RENDER PAGES*******/
  app.get('/', ViewsController.showLanding);
  app.get('/map', ViewsController.showMap);
  app.get('/clients/new', ViewsController.showNewClient);
  app.get('/elves/new', ViewsController.showNewElf);
  app.get('/login', ViewsController.showLogin);
  app.get('/logout', ViewsController.logoutUser);
  app.get('/loggedIn', isLoggedIn, ViewsController.showLoggedIn);
  app.get('/signedUp', isLoggedIn, ViewsController.showSignedUp);

  //JOBS
  app.get('/user/jobs/new', isLoggedIn, ViewsController.showNewJob);
  app.get('/jobs/new', isLoggedIn, ViewsController.showNewJob); //TODO: isloggedin check
  app.get('/client/jobs', isLoggedIn, JobController.showClientJobs); //list of jobs belonging to user
  app.get('/elf/jobs', isLoggedIn, JobController.showElfJobs);

  //USER
  app.get('/user/forgotPassword', AuthController.showForgotPassword);
  app.get('/user/details', isLoggedIn, ViewsController.showUserDetails);
  app.get('/user/address/new', isLoggedIn, ViewsController.showNewAddress);

  app.get('/testPage', ViewsController.showTestView);

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

  app.post('/clients/new', validate.validateClientFormInput, ClientController.registerNewClient);
  app.post('/elves/new', validate.validateElfFormInput, ElfController.registerNewElf);
  app.post('user/jobs/new/payment', isLoggedIn, JobController.payNewJob);
  app.post('/user/jobs/new', isLoggedIn, JobController.createNewJob); //should be client/jobs/new
  app.post('/user/details/updateClient', isLoggedIn, validate.validateUpdateForm, ClientController.updateClientDetails);
  app.post('/user/details/updateElf', isLoggedIn, validate.validateUpdateForm, ElfController.updateElfDetails);
  app.post('/user/forgotPassword', validate.validateUserEmail, AuthController.forgotPassword);
  app.post('/user/address/new', isLoggedIn, UserController.addAddress);

  app.get('*', ViewsController.showErrorPage);

};//end module.exports

/*******MIDDLEWARE*******/
//TODO: move these to a separate file
function isLoggedIn(req, res, next) {
  console.log('authenticate', req.body);
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}
