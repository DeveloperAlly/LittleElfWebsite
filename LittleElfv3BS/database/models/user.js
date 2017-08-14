const mongoose = require('mongoose');
//const bcrypt   = require('bcrypt-nodejs');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({

  //local            : {
      email        : String,
      password     : String,
      type         : String,
//  },
  facebook         : {
      id           : String,
      token        : String,
      email        : String,
      name         : String
  },
  google           : {
      id           : String,
      token        : String,
      email        : String,
      name         : String
  },

});

// generating a hash
/*userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};*/

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', UserSchema);
