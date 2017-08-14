

module.exports = {

 validateClientInput1(req, res, next) {
    console.log('userinput ok', req.body);
    return next;
  },

  validateClientFormInput1(req, res, next) {
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
       'streetNumber': { //
         notEmpty: true,
         errorMessage: 'Enter Street Number'
       },
       'streetName': { //
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
      res.render('newClient.ejs', { errors, user });
    } else {
      return next();
    }
  }, //end validateClietnForm foo

  validateUpdateForm(req, res, next) {
    return next();
  }


}; //end module.exports
