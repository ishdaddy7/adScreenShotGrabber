'use strict';
/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/

var chalk = require('chalk');
var db = require('./server/db');
var Job = db.model('job');
var JobDetail = db.model('jobDetail');
var Promise = require('sequelize').Promise;

const jobDetailSeeds = [
    {toSearch: 'http://www.cnn.com', toFind: 'google', jobId: 1},
    {toSearch: 'http://www.techcrunch.com', toFind: 'google', jobId: 1},
    {toSearch: 'http://www.llbean.com', toFind: 'mathtag', jobId: 2},
    {toSearch: 'http://www.gothamist.com', toFind: 'adnxs', jobId: 2}
]

let seedJobs = function(){
    let jobs = [
        {
            name: 'American Express Job'
        },{
            name: 'EA Sports Job'
        }
    ];

    let creatingJobs = jobs.map(function (job) {
        return Job.create(job);
    });

    return Promise.all(creatingJobs);
}
/*var seedUsers = function () {

    var users = [
        {
            email: 'testing@fsa.com',
            password: 'password'
        },
        {
            email: 'obama@gmail.com',
            password: 'potus'
        }
    ];

    var creatingUsers = users.map(function (userObj) {
        return User.create(userObj);
    });

    return Promise.all(creatingUsers);

};*/

db.sync({ force: true })
    .then(function () {
        return seedJobs();
    })
    .then(function(){
        return JobDetail.bulkCreate(jobDetailSeeds)
    })
    .then(function (result) {
        console.log(chalk.green('Seed successful!'));
        process.exit(0);
    })
    .catch(function (err) {
        console.error(err);
        process.exit(1);
    });
