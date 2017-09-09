const NodeGeocoder          = require('node-geocoder');
const Client                = require('../database/models/client');
const Elf                   = require('../database/models/elf');
const Job                   = require('../database/models/job');
//const AddressSchema         = require('../database/models/address');

module.exports = {

  addAddress(req, res, next) {
    console.log('add address', res.locals.thisUser, req.body);
    let user = res.locals.thisUser;
    let errors = [];
    const addr = {
      coordinates: '',
      streetAddress: req.body.streetAddress,
      suburb: req.body.suburb,
      postCode: req.body.postCode,
      state: req.body.state,
    };

    const addressStr =
      addr.streetAddress.trim()
      .concat(' ')
      .concat(addr.suburb.trim())
      .concat(' Australia');

    const formattedAddressStr = addressStr.toLowerCase();
    console.log('getAddressCoordinates', formattedAddressStr);
    const options = {
      provider: 'google'
    };
    const geocoder = NodeGeocoder(options);

    geocoder.geocode(formattedAddressStr)
      .then((geocodeResult) => {
        console.log('adress coords', geocodeResult);
        const latlong = {
          lat:  geocodeResult[0].latitude,
          long: geocodeResult[0].longitude,
          googlePlaceId: geocodeResult[0].extra.googlePlaceId
        };
        const geometry = {
          type: 'Point',
          coordinates: [latlong.long, latlong.lat]
        };
        console.log('got adress coords', latlong);
        addr.coordinates = latlong;
        addr.geometry = geometry;

        if (user.type === 'Client') {
          Client.findOne({ email: user.username})
           .then(client => {
             console.log('client', client);

             client.addresses.push(addr);
             client.save()
              .then(client1 => {
                console.log('savedclient', client1);
                user = client1;
                //added new address now go back to form gah
                res.render('newJob.ejs', { errors, user});

              })
              .catch(erre => {
                console.log('client find one error in add address');
              });
           })
           .catch(err => {
             console.log('client find one error in add address');
           });
        } else {
          Elf.findOne({ email: user.username})
           .then(elf => {
             console.log('elf', elf);

             elf.addresses.push(addr);
             elf.save()
              .then(elf1 => {
                console.log('savedelf', elf1);
                user = elf1;
                //added new address now go back to form gah
                res.render('newJob.ejs', { errors, user});

              })
              .catch(erre => {
                console.log('elf find one error in add address');
              });
           })
           .catch(err => {
             console.log('elf find one error in add address');
           });
        }
      })
      .catch(geoerr => {
        console.log('address coords error', geoerr);
        errors = [];
        const cerr = {
          param: 'unknownError',
          msg: 'Invalid address or address not found'
        };
        errors.push(cerr);
        //deleteAddress(elfProps.email);
        return res.render('newAddress.ejs', { errors, user });
      });
  },

  deleteAddress() {

  },

  updateAddress() {

  },

}; //END MODULE.exports


function findClosestElves(addressCoordinates) {
    console.log('addresscoords', addressCoordinates);
    //get all elf addresses within a radius of these coordinates...
    const { lng, lat } = addressCoordinates;         //reference to the query string in browser
    //this would be ..'http://google.com?lng=80&lat=20'     //query string containing the current lng and lat of user (in that order for mongoose)
    //get all the drivers near one point

    //step 1: find all the addresses
    //step 2 search through the addresses for a close one... gahhhh.
    //db.elves.find({addresses.streetAddress})

/*    Elf.geoNear(
      { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] }, //This is the GeoJSON<Object, Array> part of the mongoose geoNear function
      { spherical: true, maxDistance: 10000} //This is the options Object of the geoNear function in mongoose.
                                              //units here is in meters, so 200000 = 200km
    )
    .then(elves => {
      console.log('found these elves', elves);
    })
    .catch(findeleveserror => {
      console.log('findelveserr', findeleveserror);
    }); */
    //db.getCollection('elves')

    //this query worked in mongo
    //db.getCollection('elves').aggregate([{ $geoNear: { near: {'type': 'Point', 'coordinates':[150.8903649, -34.4123691]}, 'maxDistance': 10000, 'spherical': true, 'distanceField': 'distance'} }])

    Elf.aggregate([
        { $geoNear:
          { near: {
            'type': 'Point',
            'coordinates':[addressCoordinates.long, addressCoordinates.lat]
          },
          'maxDistance': 10000,
          'spherical': true,
          'distanceField': 'distance'}
        }
      ])
      .then(closestelves => {
        console.log('closestelves', closestelves);
      })
      .catch(findelevesnearerror => {
        console.log('findelveserr', findelevesnearerror);
      });
}
