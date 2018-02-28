var config = require('../config'),
    ClientServices = require('../services/Client.service'),
    helperServices = require('../services/helper.service'),
    moment = require('moment'),

    moment_tz = require('moment-timezone');
Passport = require('passport');
var Wallet = require('../models/Wallet.model');
var request = require('request');
var bPromise = require('bluebird');

console.log("=========================================");
console.log("Big ");

console.log("=========================================");


exports.get_wallet_detail = function(req, res) {
    var customer_id = (req.query.customer_id) ? req.query.customer_id : false;
    var user = Wallet.forge().query(function(qb) {
        qb.select('*');
        qb.where('customer_id', '=', customer_id);
    }).fetchAll().then(function(addy) {
        return addy;
    }).then(function(addy) {

        return bPromise.map(addy.models, function(addy) {

            return {

                customer_id: addy.get("customer_id"),
                amount: addy.get("amount"),

            }

        })
    });

    user.then(function(user) {
            if (user.length == 0) {

                var user = [];
                res.json({
                    "error": false,
                    status: "success",
                    "message": "User mobile no is not registered",
                    result: user
                });
            } else {

                res.json({
                    "error": false,
                    status: "success",
                    "message": "These are the records",
                    result: user
                });

            }
        })
        .catch(function(err) {
            return errors.returnError(err, res);
        });



};