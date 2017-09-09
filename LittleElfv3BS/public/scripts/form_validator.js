const User     = require('../../database/models/user');

module.exports = {

 validateUserEmail(req, res, next) {
   const user = req.body;
   User.findOne({ username: req.body.email })
    .then((auser) => {
      console.log(auser);
      if (auser == null) {
        console.log('no user by this email found. Sign up instead');
        const errors = [{ msg: 'No user by this email found.' }];
        return res.render('forgot.ejs', { user, errors });
      }
      next();
    })
    .catch((err) => {
      console.log('not such email exists');
      console.log('no user by this email found. Sign up instead');
      const errors = [{ msg: 'No user by this email found.' }];
      return res.render('forgot.ejs', { user, errors });
    });
},

  validateClientFormInput(req, res, next) {
    console.log('validateClientFormInput');

    req.checkBody({
      'email': {
         isEmail: {
           errorMessage: 'Invalid Email'
         }
       },
       'password': {
         notEmpty: true,
        /* matches: {
           options: ['/^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$/', 'i'], // pass options to the validator with the options property as an array
           // options: [/example/i] // matches also accepts the full expression in the first parameter
           errorMessage: 'Password must contain at least one letter, one number, and be longer than six charaters.' // Error message for the parameter
         }, */
         isLength: {
           options: [{ min: 6, max: 30 }],
           errorMessage: 'Password must be longer than 6 charaters' // Error message for the validator, takes precedent over parameter message
         },
         errorMessage: 'Password required.' // Error message for the parameter
       },
       'password2': {
         matches: {
           options: [req.body.password, 'i'], // pass options to the validator with the options property as an array
           // options: [/example/i] // matches also accepts the full expression in the first parameter
           errorMessage: 'Passwords don\'t match.' // Error message for the parameter
         },
       },
       'firstName': { //
         isLength: {
           options: [{ min: 2, max: 30 }],
           errorMessage: 'First name must be longer than 2 characters' // Error message for the validator, takes precedent over parameter message
         },
         errorMessage: 'Invalid First Name'
       },
       'lastName': { //
         isLength: {
           options: [{ min: 2, max: 30 }],
           errorMessage: 'Last name must be longer than 2 characters' // Error message for the validator, takes precedent over parameter message
         },
         errorMessage: 'Invalid Last Name'
       },
       'phone': { //
         isLength: {
           options: [{ min: 6, max: 30 }],
           errorMessage: 'Phone number not valid' // Error message for the validator, takes precedent over parameter message
         },
         errorMessage: 'Invalid Phone number'
       },
       'streetAddress': { //
         notEmpty: true,
         errorMessage: 'Enter Street Name'
       },
       'postCode': {
         notEmpty: true,
         errorMessage: 'Enter Postcode'
       }
    });

    const errors = req.validationErrors();
    console.log('errors', errors);
    if (errors) {
      const user = req.body;
      user.password = '';
      user.password2 = '';
      console.log('USER', user);
      //TODO: how to check if elf or client!?
      res.render('newClient.ejs', { errors, user });
    } else {
      return next();
    }
  }, //end validateClietnForm foo

  validateElfFormInput(req, res, next) {
    console.log('validateClientFormInput');

    req.checkBody({
      'email': {
         isEmail: {
           errorMessage: 'Invalid Email'
         }
       },
       'password': {
         notEmpty: true,
        /* matches: {
           options: ['/^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$/', 'i'], // pass options to the validator with the options property as an array
           // options: [/example/i] // matches also accepts the full expression in the first parameter
           errorMessage: 'Password must contain at least one letter, one number, and be longer than six charaters.' // Error message for the parameter
         }, */
         isLength: {
           options: [{ min: 6, max: 30 }],
           errorMessage: 'Password must be longer than 6 charaters' // Error message for the validator, takes precedent over parameter message
         },
         errorMessage: 'Password required.' // Error message for the parameter
       },
       'password2': {
         matches: {
           options: [req.body.password, 'i'], // pass options to the validator with the options property as an array
           // options: [/example/i] // matches also accepts the full expression in the first parameter
           errorMessage: 'Passwords don\'t match.' // Error message for the parameter
         },
       },
       'firstName': { //
         isLength: {
           options: [{ min: 2, max: 30 }],
           errorMessage: 'First name must be longer than 2 characters' // Error message for the validator, takes precedent over parameter message
         },
         errorMessage: 'Invalid First Name'
       },
       'lastName': { //
         isLength: {
           options: [{ min: 2, max: 30 }],
           errorMessage: 'Last name must be longer than 2 characters' // Error message for the validator, takes precedent over parameter message
         },
         errorMessage: 'Invalid Last Name'
       },
       'phone': { //
         isLength: {
           options: [{ min: 6, max: 30 }],
           errorMessage: 'Phone number not valid' // Error message for the validator, takes precedent over parameter message
         },
         errorMessage: 'Invalid Phone number'
       },
       'streetAddress': { //
         notEmpty: true,
         errorMessage: 'Enter Street Name'
       },
       'postCode': {
         notEmpty: true,
         errorMessage: 'Enter Postcode'
       }
    });

    const errors = req.validationErrors();
    console.log('errors', errors);
    if (errors) {
      const user = req.body;
      user.password = '';
      user.password2 = '';
      console.log('USER', user);
      //TODO: how to check if elf or client!?
      res.render('newElf.ejs', { errors, user });
    } else {
      return next();
    }
  }, //end validateClietnForm foo

  validateUpdateForm(req, res, next) {
    return next();
  }


}; //end module.exports
