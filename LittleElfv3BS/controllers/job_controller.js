//TODO: Move db functions to queries folder/files
//TODO: Create helper functions for logic, remove from code

const Job         = require('../database/models/job');
const Client      = require('../database/models/client');

module.exports = {
/*******RENDER PAGES*******/
  showNewJob(req, res, next) {
    let address = {};
    Client.findOne({ email: req.user.username })
      .then((user) => {
        //console.log('newjob user', user.address[0].streetName);
        res.render('newJob.ejs', { user });
      })
      .catch((err) => { console.log('client findone catcherror ', err); });
  },
  showJobs(req, res, next) {
    res.render('showJobs.ejs');
  },
  /*******RENDER PAGES*******/
  createNewJob(req, res, next) {
    console.log('post route', req.body, req.user);
    Client.findOne({ email: req.user.username })
      .then((aclient) => {
        console.log('create newjob user', aclient);
        let job = {
          numberOfLoads: req.body.numberOfLoads,
          jobType: req.body.jobType,
          clientID: aclient._id,
          pickupDate: req.body.date,
          pickupTime: req.body.time,
          pickupDetails: req.body.pickupdetails,
          pickupAddress: {
            unitNumber: req.body.unitNumber,
            streetNumber: req.body.streetNumber,
            streetName: req.body.streetName,
            suburb: req.body.suburb,
            postCode: req.body.postcode,
            state: req.body.state,
          },
          jobActive: true,
        };
        Job.create(job)
          .then((newjob) => {
            console.log('job created!', newjob);
            res.render('showJobs.ejs', {newjob});
          })
          .catch((err) => { console.log('create job catch error ', err); });
      })
      .catch((err) => { console.log('client findone catch error ', err); });
  //Job.create()
  },

}; //end exports
