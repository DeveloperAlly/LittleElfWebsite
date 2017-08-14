//The schema for a job
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema({
  rating: Number,
  feedbackMessage: String,
  other: String
});

module.exports = FeedbackSchema;
