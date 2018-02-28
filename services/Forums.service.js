var config = require('../config'),
    Forums = require('../models/Forums.model'),
    moment = require('moment'),
    moment_tz = require('moment-timezone'),
    Promise = require("bluebird"),
    helperServices = require('../services/helper.service');
var request = require('request');


exports.addForums = function(params) {
    var ForumsData = new Forums({
        "category": (params.category) ? params.category : false,
        "title": (params.title) ? params.title : false,
        "story": (params.story) ? params.story : false,
        "comments": (params.comments) ? params.comments : false,
        "date": (params.date) ? params.date : false,
        "id": (params.id) ? params.id : false
    });
    return ForumsData.save(null).tap(function(model) {
        ForumsData = model;
        return ForumsData;
    }).then(function(ForumsData) {
        return ForumsData;
    }).catch(function(err) {
        return err;
    });
};