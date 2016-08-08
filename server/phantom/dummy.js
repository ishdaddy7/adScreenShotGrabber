'use strict';
let idToRun = 1;
const db = require('../db')
const JobDetail = db.model('jobDetail');
const Job = db.model('job');

var _pages;

console.log('Hey this is dummyjs and I just ran at ', new Date())

Job.findOne({
  where: {
    id: 1
  },
  include: [JobDetail]
})
.then(result =>{
  console.log(result)
})
/*

JobDetail.findAll({
  where: {
    jobId: idToRun
  }
})
.then(result => {
  _pages = result;
  console.log(_pages);
});*/

