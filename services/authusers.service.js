var user = require('../models/user.model'),
    forgotPassword = require('../models/forgotPassword.model'),
    moment = require('moment'),
    promise = require('bluebird'),
    helperServices = require('../services/helper.service'),
    errorTypes = require('../errortypes');
exports.checkSecureToken = function(token, userId, transaction) {
    return new forgotPassword({
        secureToken: token
    }).query(function(qb) {
        qb.where('userId', userId);
    }).fetch().then(function(data) {
        if (!data)
            return 401;

        if (data.get('expirationTime') < moment().format("YYYY-MM-DD HH:mm:ss"))
            return 402;

        return 200;
    });
};

exports.resetPassword = function(newPassword, email, UserID, transaction) {
    return promise.try(function() {
        if (!newPassword) throw new errorTypes.UnauthorisedError('Password Cannot Be Blank');
        var decryptedPass = helperServices.encryption(newPassword, email);
        var authUpdateOptions = {
            patch: true
        };
        if (transaction) authUpdateOptions.transacting = transaction;
        return new user({
            Id: UserID
        }).save({
            password: decryptedPass
        }, authUpdateOptions);
    });
}