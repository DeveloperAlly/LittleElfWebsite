const isEmail = require('isemail');
//const nodemailer = require('nodemailer')

module.exports = {

//takes a String returns a Boolean
function validateEmail(email){
  //API: validate(email, [options], [callback])
  //see npm isemail for more details
  return(isEmail.validate(email));
},

function sendSuccessfulSignupEmail(toEmail){
  const fromEmail = 'no_reply@littleelflaundry.com';
  //use nodemailer
},

function sendValidateEmailEmail(toEmail){
  //use nodemailer
},

function sendPasswordResetEmail(toEmail){
  //use nodemailer
},



}; //end exports
