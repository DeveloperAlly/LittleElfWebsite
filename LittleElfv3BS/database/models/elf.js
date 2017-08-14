//The schema for a basic user
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AddressSchema = require('./address');
const JobSchema = require('./job');

const ElfSchema = new Schema({
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
    default: 'Elf'
  },
  isDeleted: {  //active elves  = false. Deleted profile = true
    type: Boolean,
    default: false
  },
  stars: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  elfBio: {
    type: String,
    default: 'I love to wash!'
  },
  addresses: [AddressSchema],
  jobs: [JobSchema],     //an array of jobs that are assigned to this user OR elf??
  //  jobs: [{
  //    type: Schema.Types.ObjectId,  //type is a reference to another collection document
  //    ref: 'job'                  //from the user.js file -> the name we assigned const User = mongoose.model('user', UserSchema);
  //  }],
  //paymentDetails: [PaymentSchema], //no idea how this works yet, may be multiple options
  //posts: [FeedbackSchema],     //tbd
});

module.exports = mongoose.model('elf', ElfSchema);
