'use strict';
var _ = require('lodash');
var Sequelize = require('sequelize');
var db = require('../_db');

module.exports = db.define('job', {
    name: {
        type: Sequelize.STRING
    },
    status: {
        type: Sequelize.ENUM('pending', 'inProgress', 'complete', 'error'),
        defaultValue: 'pending'
    },
    started: {
        type: Sequelize.DATE()
    },
    finished: {
        type: Sequelize.DATE()
    },
    note: {
        type: Sequelize.TEXT
    }
});
