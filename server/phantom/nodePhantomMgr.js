'use strict';
const idToRun = process.argv[2];
const db = require('../db');
const JobDetail = db.model('jobDetail');
const Job = db.model('job');
const fs = require('fs');
let phantomScript = 'phantomBrowser.js';
let _job;

console.log(`nodePhantomMgr: starting up at ${new Date()} for Job Id ${idToRun}`);
//finds pre-seeded detail for now.
Job.findById(idToRun,{include: [JobDetail]})
.then(job => {
  _job = job;
  let counter = 0;
  let checkDetail = function(){
    counter++;
    let jobComplete = true;
    job.jobDetails.forEach(detail => {
      //if the detail has not been found, try to find it
      if (!detail.found){
          jobComplete = false;
          console.log(`nodePhantomMgr: spawning processes for JobId ${idToRun} // JobDetail Id ${detail.id}`);
          const spawn = require('child_process').spawn;
          const scrape = spawn('phantomjs', [phantomScript, detail.toSearch, detail.toFind, detail.id, '--ssl-protocol=any']);
          scrape.stdout.on('data', (data) => {
            try{
              //deal with actual found data
              var inputFromBrowser = JSON.parse(data);
              console.log('nodePhantomMgr: phantomBrowser stdout is... (JSON) - ', inputFromBrowser);
              detail.update(inputFromBrowser)
            } catch(error){
              //regular logging stuff
              console.log(`nodePhantomMgr: phantomBrowser stdout is ...(logging) - ${data}`)
            }
          });
          scrape.on('close', (code) => {
            console.log(`nodePhantomMgr: child process exited with code ${code}`)
          });
      }
    });
    // if all details are complete, set the job to complete
    if(jobComplete){
      console.log(`nodePhantomMgr: all details complete for job ${idToRun}. setting job status to complete`);
      _job.update({status: 'complete', finished: Date.now(), note: 'All set'})
      clearInterval(runCheckDetail);
    }
    //configure to check more times
    if(counter === 15) {
      _job.update({status: 'error', finished: Date.now(), note: 'One or more job details were not completed'});
      clearInterval(runCheckDetail);
      return;
    }
  }
  //run this periodically for each process until counter var reaches its limit
  let runCheckDetail = setInterval(checkDetail, 1000 * 60);
})
.catch(console.log);


