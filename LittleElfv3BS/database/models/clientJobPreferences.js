//The schema for a job
const mongoose        = require('mongoose');
const Schema          = mongoose.Schema;
const AddressSchema = require('./address');

const clientJobPreferencesSchema = new mongoose.Schema({
  numberOfLoads: {
    type: Number,
    default: 1,
  },
  pickupDay: String, //how do i do this?
  pickupDate: Date,
  pickupTime: String,
  dropoffTime: String,
  options: String,
  hypoallergenic: Boolean,
  fastTurnaround: Boolean,
});

module.exports = clientJobPreferencesSchema;
