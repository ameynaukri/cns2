var Products = require('../models/Products.model'),
    User = require('../models/Users.model'),
    moment = require('moment'),
    moment_tz = require('moment-timezone'),
    Promise = require("bluebird"),
    helperServices = require('../services/helper.service');


exports.getreview = function() {

    var fetchParams = {
        withRelated: ["productDetail"]
    };
    return Products.forge().query(function(qb) {
        //qb.where("customer_id",id)
    }).fetchAll(fetchParams).then(function(result) {
        return result;
    }).catch(function(err) {
        return err;
    });

};