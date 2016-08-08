'use strict';
var db = require('./_db');
module.exports = db;

const User = require('./models/user');
const Job = require('./models/job');
const JobDetail = require('./models/jobDetail');

Job.hasMany(JobDetail);
JobDetail.belongsTo(Job);

