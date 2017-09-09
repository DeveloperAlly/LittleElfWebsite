//The schema for a job
const mongoose        = require('mongoose');
const Schema          = mongoose.Schema;
const AddressSchema   = require('./address');
const FeedbackSchema  = require('./feedback');

const JobSchema = new mongoose.Schema({
    //the client id requesting the job
  client: {
    type: Schema.Types.ObjectId,  //type is a reference to another collection document
    ref: 'client'                  //from the user.js file -> the name we assigned const User = mongoose.model('user', UserSchema);
  },
  elf: {
    type: Schema.Types.ObjectId,  //type is a reference to another collection document
    ref: 'elf'                  //from the user.js file -> the name we assigned const User = mongoose.model('user', UserSchema);
  },
  clientID: {
    type: String,  //type is a reference to another collection document
  },
  elfID: {
    type: String,  //type is a reference to another collection document
  },
  price: {
    type: String
  },
  paid: {
    type: Boolean
  },
  numberOfLoads: {
    type: Number,
    default: 1,
  },
  jobType: {
    type: String,  //budget, normal, premium etc
    required: false
  },
  isActive: { //this flag represents that the job is an active job. It could be in many different states however
    type: Boolean,
    default: false,
  },
  isAssigned: {
    type: Boolean,
    default: false,
  }, //currently assigned to an elf for washing
  isComplete: {
    type: Boolean,
    default: false,
  }, //completed job
  status: {
    type: String,     //requested (no elf assigned yet), assigned & waiting on pickup, being washed, requires client Answer, requires Elf answer, delivered/done etc
    default: 'requested'
  },
  datePosted: {
    type: Date,
    default: Date.now,
  },       //when this job was requested initially
  pickupDay: String,
  pickupDate: {
    type: Date,
  },
  pickupTime: {
    type: String,
  },
  pickupAddress: [AddressSchema], //just references not objects
  pickupInstructions: String,  //optional message with additional details
  dropoffTime: {
    type: String
  },
  expectedReturnDate: {
    type: Date,
  },
  flagJob: Boolean,
  flagMessage: String,          //something wrong with this load
  clientFeeback: [FeedbackSchema],
  elfFeedback: [FeedbackSchema],
});

module.exports = mongoose.model('job', JobSchema);

/*
clientID: {
  type: Schema.Types.ObjectId,  //type is a reference to another collection document
  ref: 'client'                  //from the user.js file -> the name we assigned const User = mongoose.model('user', UserSchema);
},
*/
