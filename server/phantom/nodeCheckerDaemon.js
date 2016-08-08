'use strict';

const db = require('../db')
const Job = db.model('job');

  let checkPending = function(){
    console.log(`daemon: starting up at ${new Date()}`)
    let _pending;
    Job.findAll({
      where: {
        status: 'pending'
      }
    })
    .then(result => {
      _pending = result;
      if(_pending.length ===0){
        console.log('daemon: no pending jobs');
        return;
      } else{
      //spawn a node process for each pending job, passing in the job Id. The node process will pick up the job Id, query for the pages and go.
        _pending.forEach(job => {
          job.update({status: 'inProgress', started: Date.now()});
          console.log(`daemon: found pending job id ${job.id}, spawning child process`);
          const spawn = require('child_process').spawn;
          const run = spawn('node', ['nodePhantomMgr.js', job.id]);
          run.stdout.on('data', (data) => {
            console.log(`daemon: nodePhantomMgr stdout is for job ${job.id}... ${data}`)
          });
        });
      }
    });
  }

//check for pending stuff every 60 seconds
//  let runCheckPending = setInterval(checkPending, 1000*15);

//run once for now!
checkPending();
