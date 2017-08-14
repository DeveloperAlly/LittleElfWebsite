
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AddressSchema = require('./address');
const JobSchema = require('./job');

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
  jobs: [JobSchema]
});

module.exports = mongoose.model('client', ClientSchema);
