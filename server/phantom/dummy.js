'use strict';
let idToRun = process.argv[2];
const db = require('../db')
const JobDetail = db.model('jobDetail');

var _pages;

console.log('Hey this is dummyjs and I just ran at ', new Date())

/*JobDetail.findAll({
  where: {
    jobId: idToRun
  }
})
.then(result => {
  _pages = result;
  console.log(_pages);
});
*/
