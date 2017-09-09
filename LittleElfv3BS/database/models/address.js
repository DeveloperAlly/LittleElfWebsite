//The schema for a basic user
const mongoose = require('mongoose');


const PointSchema = new mongoose.Schema({
  type: { type: String, default: 'Point' },
  coordinates: { type: [Number], index: '2dsphere' }
});

const GeoCodeSchema = new mongoose.Schema({
  lat: {
    type: String
  },
  long: {
    type: String
  },
  googlePlaceId: {
    type: String
  }
});

const AddressSchema = new mongoose.Schema({
  geometry: PointSchema,      //the lng and lat coordinates //geoJson.org -> mongo's system of saving coordinates //subdocument
  coordinates: GeoCodeSchema,
  streetAddress: {
    type: String,
    required: true
  },
  suburb: {
    type: String,
    required: true
  },
  postCode: {
    type: Number,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  instructions: String,   //delivery / pickup instructions and additional info for elves
  other: String
});


module.exports = AddressSchema;
//module.exports = mongoose.model('address', AddressSchema);
