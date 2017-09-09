
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AddressSchema = require('./address');
const JobSchema = require('./job');
const ClientJobPreferencesSchema = require('./clientJobPreferences');

const ClientSchema = new Schema({
  email: {
    type: String,    //primary key
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  phone: {
    type: Number,
    required: false
  },
  active: {
    type: Boolean,
    default: false
  },
  userType: {
    type: String,
    default: 'Client'
  },
  addresses: [AddressSchema],
  jobs: [{
    type: Schema.Types.ObjectId,  //type is a reference to another collection document
    ref: 'job'                  //from the user.js file -> the name we assigned const User = mongoose.model('user', UserSchema);
  }],
  //jobs: [JobSchema],
  jobPreferences: [ClientJobPreferencesSchema]
});

module.exports = mongoose.model('client', ClientSchema);
