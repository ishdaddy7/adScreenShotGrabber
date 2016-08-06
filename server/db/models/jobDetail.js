'use strict';
var _ = require('lodash');
var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('jobDetail', {
    toSearch: {
        type: Sequelize.STRING
    },
    toFind: {
        type: Sequelize.STRING
    },
    found: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    pathToFile: {
        type: Sequelize.STRING
    }
});
