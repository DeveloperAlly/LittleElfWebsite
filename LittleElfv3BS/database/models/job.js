//The schema for a job
const mongoose        = require('mongoose');
const Schema          = mongoose.Schema;
const AddressSchema   = require('./address');
const FeedbackSchema  = require('./feedback');

const JobSchema = new mongoose.Schema({
  numberOfLoads: {
    type: Number,
    default: 1,
  },
  jobType: {
    type: String,  //budget, normal, premium etc
    required: false
  },
  jobActive: {
    type: Boolean,
    default: false,
  },
  clientID: String,
  elfID: String,
  isAssigned: {
    type: Boolean,
    default: false,
  }, //currently assigned to an elf for washing
  isComplete: {
    type: Boolean,
    default: false,
  }, //completed job
  status: {
    type: String,     //requested, waiting on pickup, being washed, requires client Answer, requires Elf answer, delivered/done etc
    default: 'requested'
  },
  datePosted: {
    type: Date,
    default: Date.now,
  },       //when this job was requested initially
  pickupDate: {
    type: Date,
  },
  pickupTime: {
    type: String,
  },
  pickupAddress: [AddressSchema],
  pickupDetails: String,  //optional message with additional details
  expectedReturnDate: {
    type: Date,
  },
  desiredReturnTime: {
    type: String,
  },
  flagJob: Boolean,
  flagMessage: String,          //something wrong with this load
  clientFeeback: [FeedbackSchema],
  elfFeedback: [FeedbackSchema],
});

module.exports = JobSchema;
