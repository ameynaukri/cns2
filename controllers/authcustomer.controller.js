/**
 * authentication controller, for authentication Customer
 */
var config = require('../config'),
    Customer = require('../models/Customer.model'),
    //authService = require('../services/authCustomers.service'),
    Passport = require('passport');

//Authorise Customer
exports.authorizseCustomer = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).send({
            "error": true,
            "status": "error",
            "message": "Customer is not authorized",
            "result": "Customer is not authorized"
        });
    }

    next();
}
//login
exports.login = function(req, res, next) {
    console.log("login");

    password = (req.body.Password) ? req.body.Password : false;
    username = (req.body.username) ? req.body.username : false;
    id = (req.body.id) ? req.body.id : false;

    if (password)
        req.body.password = password;
    if (!req.body.password || !username) {
        return res.json({
            "StatusCode": 304,
            "result": "Please send required parameter.",
            "ResponseMessage": "Please send required parameter."
        });
    } else {
        return Passport.authenticate('local',
            function(err, Customer, info) {
                if (err) {
                    return errors.returnError(err, res);
                }
                if (!Customer) {
                    if (info.error == true && info.statusCode == 201) {
                        return res.json({
                            "StatusCode": 404,
                            "result": null,
                            "ResponseMessage": "Customer doesn't exist."
                        });
                    } else if (info.error == true && info.statusCode == 202) {
                        return res.json({
                            "StatusCode": 401,
                            "result": [],
                            "ResponseMessage": "Invalid Password."
                        });

                    }
                } else {
                    return req.logIn(Customer, function(err) {
                        console.log("login");
                        res.setHeader('auth-key', 'Ak12mr27Xwg@d89ul');
                        return res.json({
                            "StatusCode": 200,
                            "result": Customer,
                            "ResponseMessage": "Success"
                        });
                    });
                }
            }
        )(req, res, next);
    }
};

exports.logout = function(req, res) {
    var registrationId = (req.body.RegistrationId) ? req.body.RegistrationId : false;
    authService.logout(req.body.CustomerID, registrationId).then(function(model) {
        res.json({
            "error": false,
            "status": "success",
            "message": "Customer logout successfully.",
            "result": "Customer logout successfully."
        });
    });
};