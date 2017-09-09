//TODO: Move db functions to queries folder/files
//TODO: Create helper functions for logic, remove from code

const Job         = require('../database/models/job');
const Client      = require('../database/models/client');
const Elf         = require('../database/models/elf');


module.exports = {

  //find the client and then the jobs
  showClientJobs1(req, res, next) {
    const user = res.locals.thisUser;
    const myjobs = [];
    Client.findOne({ email: user.username })
      .then(aclient => {
        aclient.jobs.forEach((job) => {
          console.log('job', job);
          Job.findById({ _id: job })
            .then(ajob => {
              console.log('ajob in show client jobs', ajob);
              myjobs.push(ajob);
            })
            .catch();
        });
        console.log('jobaarray', myjobs);
        res.render('showClientJobs.ejs', { myjobs });
      })
      .catch(); //didn't find client
  },

  //find all jobs belonging to the client
  showClientJobs(req, res, next) {
    console.log('USER', res.locals.thisUser);
    const user = res.locals.thisUser;
    Client.findOne({ email: user.username })
      .then(aclient => {
        Job.find({ clientID: aclient._id })
          .then(myjobs => {
            res.render('showClientJobs.ejs', { myjobs });
          })
          .catch(); //didnt find jobs
      })
      .catch(); //didn't find client
  },

  showElfJobs(req, res, next) {
    res.render('showElfJobs.ejs');
  },

  payNewJob(req, res, next) {
    const jobParams = getJobParameters(req.body);
    console.log('paynewjob', req.body, jobParams);
    const amount = 31.00;
    res.render('newJobPayment.ejs', { amount });
  },

  createNewJob(req, res, next) {
    console.log('add a job', req.body);
    const user = res.locals.thisUser; //need clients cred's
    //deleteAllClientJobs(user.username); //works - only deletes the reference
    //variables
    let prefs = {};

    const newjobParams = getJobParameters(req.body);
    newjobParams.pickupDate = getDate(req.body.date);
    newjobParams.expectedReturnDate = getReturnDate(newjobParams.pickupDate, newjobParams.fastTurnaround);
    newjobParams.pickupDay = getDay(req.body.date);
    console.log('newjobParams', newjobParams);

  //create a job
  //need to know the clients id and the address reference
    Client.findOne({ email: user.username })
      .then(aclient => {
        console.log('foundclient', aclient);
        newjobParams.pickupAddress = aclient.addresses[req.body.pickupAddress];
        newjobParams.clientID = aclient._id;
        newjobParams.client = aclient;
        //save preferences
        if (req.body.preferences === 'on') {
          prefs = savePreferences(req.body, newjobParams);
          //aclient.jobPreferences[0] = prefs; //hmmm? save them
        }
        //create the job
        console.log('jobparams', newjobParams);
        Job.create(newjobParams)
          .then(newJob => {
            console.log('new job', newJob);
            newJob.save()
              .then(savedJob => {
                console.log('savedJob', savedJob);
                //save to the clients array also?
                aclient.jobs.push(savedJob);
                aclient.save()
                  .then(sclient => {
                    console.log('updated client with a job ', sclient);
                    //viewClientJobs(res);
                    res.redirect('/client/jobs');
                  })
                  .catch();
                //now find the closest available elf.....
                findClosestElves(newjobParams.pickupAddress.coordinates);
              })
              .catch(jobsaveerr => {
                console.log('jobsave error', jobsaveerr);
              });
          })
          .catch(createjoberr => {
            console.log('create job error', createjoberr);
          });
    })
    .catch(findclienterr => {
      console.log('findclienterr', findclienterr);
    });

  },


}; //end exports

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
            'coordinates':[parseFloat(addressCoordinates.long), parseFloat(addressCoordinates.lat)]
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

function getJobParameters(params) {
  const newjobParams = params;
  newjobParams.isActive = true;
  newjobParams.hypoallergic = false;
  newjobParams.fastTurnaround = false;
  if (!params.hypoallergic) {
    newjobParams.hypoallergic = true;
  }
  if (!params.fastTurnaround) {
    newjobParams.fastTurnaround = true;
  }
  return newjobParams;
}

//ONLY DELETES THE REFERENCES IN THE CLIENT MODEL - not the actual jobs!
//jobs are therefore still 'findable' in the Job model.
function deleteAllClientJobs(email) {
  Client.findOne({ email })
    .then(aclient => {
      aclient.jobs = [];
      aclient.save()
        .then((savedclient) => console.log('client updated', savedclient))
        .catch();
    })
    .catch();
}

function getDate(inputdate) {
  console.log('inputdate', inputdate);
  const split = inputdate.split(' ');
  console.log('split', split);
  const split2 = split[1].split('/');
  console.log('split2', split2);
  const year = split2[2];
  const month = split2[1];
  const day = split2[0];
  const pudate = new Date();
  pudate.setUTCDate(parseInt(day) - 1); //the day and month start at 0!!
  pudate.setUTCFullYear(parseInt(year));
  pudate.setUTCMonth(parseInt(month) - 1);
  console.log('formatted pudate', pudate, pudate.toString());
  return pudate;
}

function getReturnDate(date, express) {
  const returnDate = new Date();
  if (express) {
    returnDate.setDate(date.getDate() + 1);
    return returnDate;
  }
  returnDate.setDate(date.getDate() + 2);
  console.log('returnDate', returnDate);
  return returnDate;
}

function getDay(date) {
  const split = date.split(' ');
  const day = split[0];
  console.log('day', day);
  return day;
}

function savePreferences(body, newjobParams) {
  //save the preferences
  console.log('pickupAddress', body.pickupAddress);
  const prefs = {
    isActive:           true,
    status:             'requested', //default anyway
    numberOfLoads:      body.numberOfLoads,
    pickupDay:          newjobParams.pickupDay,
    pickupDate:         newjobParams.pickupDate,
    pickupTime:         body.pickupTime,
    dropoffTime:        body.dropoffTime,
    pickupAddress:      newjobParams.pickupAddress,
    pickupInstructions: body.pickupInstructions,
    hypoallergic:       newjobParams.hypoallergic,
    fastTurnaround:     newjobParams.fastTurnaround,
    client:             {},
    clientID:           ''
  };
  console.log('prefs', prefs);
  return prefs;
}

function viewClientJobs(res) {
  const user = res.locals.thisUser;
  const jobArray = [];
  Client.findOne({ email: user.username })
    .then(aclient => {
      aclient.jobs.forEach((job) => {
        console.log('job', job);
        Job.findById({ _id: job })
          .then(ajob => {
            console.log('ajob', ajob);
          })
          .catch();
      });
    })
    .catch(); //didn't find client
}
