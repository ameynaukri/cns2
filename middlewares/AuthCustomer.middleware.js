/**
 * authentication controller, for authentication user
 */
var config         = require('../config');

//Authorise User
/*exports.authorizseUser = function(req,res,next){
    if (!req.isAuthenticated()) {
        return res.status(401).send({"error":true,"status" : "error", "message" : "User is not authorized","result": "User is not authorized"});
    }
    next();
}*/
exports.authorizseCustomer = function(req,res,next){
	console.log("request header");
	console.log(req.headers['auth-key']);
    var AutherKey = (req.headers['auth-key'])?req.headers['auth-key']:false;
    if(AutherKey && AutherKey==config.Authorkey)
        next();
    else
        return res.send("Missing Authorization-Token");
}