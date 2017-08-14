//The schema for a job
const mongoose = require('mongoose');
const UserSchema = require('./client');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
  paymentType: String,
  paymentDetails: Object //who knows
});

const Payment = mongoose.model('user', PaymentSchema);

module.exports = Payment;
