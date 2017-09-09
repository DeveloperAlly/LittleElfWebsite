const mongoose = require('mongoose');
const bcrypt   = require('bcrypt-nodejs');
const passportLocalMongoose = require('passport-local-mongoose');

const SALT_ROUNDS = 10;

const UserSchema = new mongoose.Schema({

  email                 : String,
  password              : String,
  resetPasswordToken    : String,
  resetPasswordExpires  : String,
  type                  : String, //user type

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

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', UserSchema);


/*
// never save the password in plaintext, always a hash of it
UserSchema.pre('save', (next) => {
    const user = this;

    if (!user.isModified('password')) {
        return next();
    }

    // use bcrypt to generate a salt
    bcrypt.genSalt(SALT_ROUNDS, (err, salt) => {
        if (err) {
            return next(err);
        }

        // using the generated salt, use bcrypt to generate a hash of the password
        bcrypt.hash(user.password, salt, (error, hash) => {
            if (err) {
                return next(error);
            }

            // store the password hash as the password
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.isPasswordValid = (rawPassword, callback) => {
    bcrypt.compare(rawPassword, this.password, (err, same) => {
        if (err) {
            callback(err);
        }
        callback(null, same);
    });
};
*/


// generating a hash
/*userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};*/
