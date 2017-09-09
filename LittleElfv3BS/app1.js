const express               = require('express');
const mongoose              = require('mongoose');
const passport              = require('passport');
const bodyParser            = require('body-parser');
const expressValidator      = require('express-validator');
const LocalStrategy         = require('passport-local');
//const flash                 = require('express-flash');
const nodemailer            = require('nodemailer');
//const bcrypt                = require('bcrypt-nodejs');
const User                  = require('./database/models/user');
const routes                = require('./routes/routes');

const app                   = express();

app.set('view engine', 'ejs'); //enable ejs files
app.set('views', './public/templates');
//parse the incoming data json using the middleware library (must put this above routes call)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());

//make view stylesheets & scripts available
app.use(express.static('public'));

//=========DB CONNECT=======//
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/LittleElfDB', {
//mongoose.connect('mongodb://LittleElf:L1ttle3lf@10.0.29.41:27017/admin', {
  useMongoClient: true
}).then(() => {
  console.log('mongo connected');
}).catch((err) => {
  console.log('Error connecting to mongo: ', err);
});

//=========PASSPORT INIT=======//
app.use(require('express-session')({
  secret: 'Little Elf is sooo awesomeness',
  resave: false,
  saveUninitialized: false
}));

//subnet-079a9671
//app.use(flash());
//add bower components to project
//app.use(express.static(path.join(__dirname, 'bower_components')));
//app.use(express.static(__dirname, 'bower_components'));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, User.authenticate()));
//passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
 app.use((req, res, next) => {
  res.locals.login = req.isAuthenticated();
  res.locals.thisUser = req.user;
  next();
});

routes(app);

app.use((err, req, res, next) => {
  res.status(422).send({ error: err.message });
});

module.exports = app;
