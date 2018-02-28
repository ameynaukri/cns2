/**
 * authentication controller, for authentication user
 */
var config = require('../config'),
    user = require('../models/user.model'),
    //authService = require('../services/authusers.service'),
    Passport = require('passport');

//Authorise User
exports.authorizseUser = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).send({
            "error": true,
            "status": "error",
            "message": "User is not authorized",
            "result": "User is not authorized"
        });
    }

    next();
}
//login
exports.login = function(req, res, next) {
    console.log("login");

    password = (req.body.Password) ? req.body.Password : false;
    username = (req.body.username) ? req.body.username : false;
    usertype = (req.body.usertype) ? req.body.usertype : false;
    // id = (req.body.id)?req.body.id:false;

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
            function(err, user, info) {
                if (err) {
                    return errors.returnError(err, res);
                }
                if (!user) {
                    if (info.error == true && info.statusCode == 201) {
                        return res.json({
                            "StatusCode": 404,
                            "result": null,
                            "ResponseMessage": "User doesn't exist."
                        });
                    } else if (info.error == true && info.statusCode == 202) {
                        return res.json({
                            "StatusCode": 401,
                            "result": [],
                            "ResponseMessage": "Invalid Password."
                        });

                    }
                } else {
                    return req.logIn(user, function(err) {
                        console.log("login");
                        res.setHeader('auth-key', 'Ak12mr27Xwg@d89ul');
                        return res.json({
                            "StatusCode": 200,
                            "result": user,
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
    authService.logout(req.body.UserID, registrationId).then(function(model) {
        res.json({
            "error": false,
            "status": "success",
            "message": "User logout successfully.",
            "result": "User logout successfully."
        });
    });
};