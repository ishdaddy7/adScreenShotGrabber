'use strict';

const db = require('../db')
const Job = db.model('job');

  let checkPending = function(){
    let _pending;
    Job.findAll({
      where: {
        status: 'pending'
      }
    })
    .then(result => {
      _pending = result;
      //spawn a node process for each pending job, passing in the job Id. The node process will pick up the job Id, query for the pages and go.
      _pending.forEach(job => {
        const spawn = require('child_process').spawn;
        const run = spawn('node', ['dummy.js', job.id]);
        run.stdout.on('data', (data) => {
          console.log(`stdout: ${data}`)
        });
      });
    });
  }

  let runChekPending = setInterval(checkPending, 1000*60);
