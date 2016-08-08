const db = require('../../../db');
const JobDetail = db.model('jobDetail');
const Job = db.model('job');
var router = require('express').Router();
module.exports = router;

router.param('id', function(req, res, next, id){
  var _id = id;
  Job.findById(_id, {include: [JobDetail]})
  then(job => {
    if(!job) res.sendStatus(404)
    else req.job = job
    next();
  })
  .catch(next);
})

router.get('/', function (req, res){
  return Job.findAll({include: [JobDetail]})
  .then(result => res.json(result));
});

router.get('/:id', function (req, res){
  return res.send(req.job);
});

router.put('./:id', function (req, res){
  return req.job.update(req.body)
  .then(result => res.json(result));
});

router.post('/', function (req, res, next){
  return Job.create(req.body)
  .then(result => res.stats(204).json(result))
  .catch(next);
})
