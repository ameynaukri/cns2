var config = require('../config'),
    ClientServices = require('../services/Client.service'),
    helperServices = require('../services/helper.service'),
    moment = require('moment'),

    moment_tz = require('moment-timezone');
Passport = require('passport');
var User = require('../models/user.model');
var request = require('request');
var bPromise = require('bluebird');
var crypto = require('crypto');



var datetime = moment(new Date());

//var day = moment("1995-12-25");
console.log("The current date time is " + datetime);

/*#######################
####GET ENQUIRY LIST###
#######################
Method:GET
Parameters:NONE
Success Output:
Failure Output:
#######################*/
exports.enter_new_password = function(req, res) {
    //exports.updateClient = function(req, res){
    console.log("updateClient");
    //console.log(req.body.password);
    console.log("The current Password is " + req.body.contact_no);
    console.log("The new Password is " + req.body.newpassword);
    console.log("The id Password is " + req.body.code);
    //console.log("The Password is cc"+req.body.cpassword);
    //password = (req.body.Password)?req.body.Password:false;
    console.log(req.query.id);
    return ClientServices.enter_new_password(req.body.code, req.body.contact_no, req.body.newpassword).then(function(result) {


        if (result)

            //res.json({"StatusCode": 200,"result": result,"ResponseMessage ":"Hello " +result.get('first_name')+" your records are update  successfully"});
            res.json({
                "StatusCode": 200,
                "result": result,
                "ResponseMessage ": "your records are update  successfully"
            });

        else
            res.json({
                "StatusCode": 301,
                "result": result,
                "ResponseMessage": "Please enter correct password here"
            });

    }).catch(function(err) {
        console.log(err);
        res.json({
            "StatusCode": err.status,
            "result": [],
            "ResponseMessage": err.messages
        });
    });


}

function randomValueHex(len) {
    return crypto.randomBytes(Math.ceil(len / 2))
        .toString('hex') // convert to hexadecimal format
        .slice(0, len); // return required number of characters
}

exports.getClient1 = function(req, res) {
    var code = randomValueHex(7)
    var contact_no = (req.body.contact_no) ? req.body.contact_no : false;
    console.log("the length of contact no " + contact_no.length);
    if (contact_no.length < 10) {
        res.json({
            "error": false,
            status: "success",
            "message": "Mobile no is not valid"
        });

    } else if (contact_no.length == 10) {

        console.log("equal " + contact_no.length);
        var userType = (req.body.userType) ? req.body.userType : false;
        var user = User.forge().query(function(qb) {
            qb.select('Id', 'password', 'username', 'email', 'contact_no', 'code', 'userType');

            qb.where('contact_no', '=', contact_no);
            qb.orWhere({
                email: contact_no
            })
        }).fetchAll().then(function(addy) {
            return addy;
        }).then(function(addy) {

            return bPromise.map(addy.models, function(addy) {


                var contact_no = addy.get("contact_no");
                var userType_data = addy.get("userType");

                console.log("the mobile no is " + contact_no);

                request("http://apivm.valuemobo.com/SMS/SMS_ApiKey.asmx/SMS_APIKeyNUC?apiKey=25EJ1QKsnIKh3pT&cellNoList=" + contact_no + "&msgText=This is a otp number please insert this number " + code + "&senderId=OCEANP", function(error, response, body) {
                    if (!error && response.statusCode == 200) {

                        console.log(body);
                    }
                })
                return {

                    username: addy.get("username"),
                    contact_no: addy.get("contact_no"),

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
                    return ClientServices.code_update(contact_no, code).then(function(Customer) {
                        if (Customer) {
                            /*request("http://apivm.valuemobo.com/SMS/SMS_ApiKey.asmx/SMS_APIKeyNUC?apiKey=25EJ1QKsnIKh3pT&cellNoList="+contact_no+"&msgText=This is a otp number please insert this number "+code+"&senderId=OCEANP", function (error, response, body) {if (!error && response.statusCode == 200) {
        	console.log(body); 
    		}
			})	*/
                            res.json({
                                "error": false,
                                status: "success",
                                "message": "Message is send mobile no ",
                                result: user
                            });
                            //res.json({"StatusCode":200,"result":Customer,"ResponseMessage":"New Customer created successfully!"}); 
                        } else {
                            res.json({
                                "StatusCode": 301,
                                "result": "Something happened wrong.",
                                "ResponseMessage": "Something happened wrong."
                            });
                        }
                    })
                    res.json({
                        "error": false,
                        status: "success",
                        "message": "Message is send mobile no ",
                        result: user
                    });
                    // res.json({"error":false, status:"success","message":"User is already exists"});
                }
            })
            .catch(function(err) {
                return errors.returnError(err, res);
            });

    } else {
        //console.log("More than  "+contact_no.length);
        res.json({
            "error": false,
            status: "success",
            "message": "Mobile no is not valid"
        });

    }

};

/*res.json({"error":false, status:"success","message":"User mobile no is not registered", result:user});
		}else{
			res.json({"error":false, status:"success","message":"Message is send mobile no ", result:user});
		}*/



exports.resetpassword_step_one = function(req, res) {
    //exports.updateClient = function(req, res){
    console.log("updateClient");
    //console.log(req.body.password);
    console.log("The current Password is " + req.body.currentpassword);
    console.log("The new Password is " + req.body.newpassword);
    console.log("The id Password is " + req.query.id);
    //console.log("The Password is cc"+req.body.cpassword);
    //password = (req.body.Password)?req.body.Password:false;
    console.log(req.query.id);


    return ClientServices.resetpassword_step_one(req.query.id, req.body.currentpassword, req.body.newpassword).then(function(result) {


        if (result)

            res.json({
                "StatusCode": 200,
                "result": result,
                "ResponseMessage ": "Hello " + result.get('first_name') + " your records are update  successfully"
            });

        else
            res.json({
                "StatusCode": 301,
                "result": result,
                "ResponseMessage": "Please enter correct password here"
            });

    }).catch(function(err) {
        console.log(err);
        res.json({
            "StatusCode": err.status,
            "result": [],
            "ResponseMessage": err.messages
        });
    });


}
exports.resetpassword_step_two = function(req, res) {
    //var clientId = (req.params.clientId)?req.params.clientId:false;
    var clientId = (req.query.clientId) ? req.query.clientId : false;
    var password = (req.body.password) ? req.body.password : false;
    console.log(req.query.clientId);


    return ClientServices.updateClient(req.query.clientId, req.body).then(function(result) {


        if (result)

            res.json({
                "StatusCode": 200,
                "result": result,
                "ResponseMessage ": "Hello " + result.get('first_name') + " your records are update  successfully"
            });

        else
            res.json({
                "StatusCode": 301,
                "result": result,
                "ResponseMessage": "Something went wrong"
            });

    }).catch(function(err) {
        console.log(err);
        res.json({
            "StatusCode": err.status,
            "result": [],
            "ResponseMessage": err.messages
        });
    });

};




/*exports.getClient1 = function(req, res){

	var contact_no = (req.body.contact_no)?req.body.contact_no:false;
	var userType = (req.body.userType)?req.body.userType:false;
	var user = User.forge().query(function (qb) {
		qb.select('Id', 'password','username','email','contact_no' ,'code','userType');
		
		qb.where('contact_no', '=', contact_no);
		qb.orWhere({email:  contact_no})
	}).fetchAll().then(function(addy) {
		return addy;
	}).then(function(addy){
		
           return bPromise.map(addy.models, function(addy){

			var contact_no = addy.get("contact_no");
			var userType_data = addy.get("userType");

			console.log("the mobile no is "+contact_no);
			var code= addy.get("code");

		
			return {
				
				
				username: addy.get("username"),
				contact_no: addy.get("contact_no"),
	        	
			}

		request("http://apivm.valuemobo.com/SMS/SMS_ApiKey.asmx/SMS_APIKeyNUC?apiKey=25EJ1QKsnIKh3pT&cellNoList="+contact_no+"&msgText=This is a otp number please insert this number "+code+"&senderId=OCEANP", function (error, response, body) {if (!error && response.statusCode == 200) {
        	console.log(body); 
    				}
					})	
			
		
		})
	});

	user.then(function (user) {
		if(user.length == 0){
			var user = [];
			res.json({"error":false, status:"success","message":"User mobile no is not registered", result:user});
		}else{
			res.json({"error":false, status:"success","message":"Message is send mobile no ", result:user});
		}
	})
	.catch(function(err) {
		return errors.returnError(err,res);
	});
};*/


/*exports.getClient1 = function(req, res){

	var contact_no = (req.body.contact_no)?req.body.contact_no:false;
	var user = User.forge().query(function (qb) {
		qb.select('Id', 'password','password','email','contact_no' ,'code');
		
		qb.where('contact_no', '=', contact_no);
		qb.orWhere({email:  contact_no})
		
	}).fetchAll().then(function(addy) {
		return addy;
	}).then(function(addy){
		
           return bPromise.map(addy.models, function(addy){
			//var dateC = moment(addy.get("date"));
			//var dateB = moment(myDate);
			var contact_no = addy.get("contact_no");
			var code= addy.get("code");
			request("http://apivm.valuemobo.com/SMS/SMS_ApiKey.asmx/SMS_APIKeyNUC?apiKey=25EJ1QKsnIKh3pT&cellNoList="+contact_no+"&msgText=This is a otp number please insert this number "+code+"&senderId=OCEANP", function (error, response, body) {if (!error && response.statusCode == 200) {
        	console.log(body); 
    				}
					})	
			return {
				
				contact_no: addy.get("contact_no"),
	        
	
			}

		
			
		
		})
	});

	user.then(function (user) {
		if(user.length == 0){
			var user = [];
			res.json({"error":false, status:"success","message":"User mobile no is not registered", result:user});
		}else{
			res.json({"error":false, status:"success","message":"Message is send mobile no ", result:user});
		}
	})
	.catch(function(err) {
		return errors.returnError(err,res);
	});
};*/

/*exports.getClient1 = function(req, res){

	var contact_no = (req.body.contact_no)?req.body.contact_no:false;
	var user = User.forge().query(function (qb) {
		qb.select('Id', 'password','password','email','contact_no' ,'code');
		
		qb.where('contact_no', '=', contact_no);
		qb.orWhere({email:  contact_no})
		
	}).fetchAll().then(function(addy) {
		return addy;
	}).then(function(addy){
		
           return bPromise.map(addy.models, function(addy){
			//var dateC = moment(addy.get("date"));
			//var dateB = moment(myDate);
			var contact_no = addy.get("contact_no");
			var code= addy.get("code");
			request("http://apivm.valuemobo.com/SMS/SMS_ApiKey.asmx/SMS_APIKeyNUC?apiKey=25EJ1QKsnIKh3pT&cellNoList="+contact_no+"&msgText=This is a otp number please insert this number "+code+"&senderId=OCEANP", function (error, response, body) {if (!error && response.statusCode == 200) {
        	console.log(body); 
    				}
					})	
			return {
				
				contact_no: addy.get("contact_no"),
	        
	
			}

		
			
		
		})
	});

	user.then(function (user) {
		if(user.length == 0){
			var user = [];
			res.json({"error":false, status:"success","message":"User mobile no is not registered", result:user});
		}else{
			res.json({"error":false, status:"success","message":"Message is send mobile no ", result:user});
		}
	})
	.catch(function(err) {
		return errors.returnError(err,res);
	});
};
*/




exports.getClient = function(req, res) {
    //var clientId = (req.params.clientId)?req.params.clientId:false;
    var clientId = (req.query.clientId) ? req.query.clientId : false;

    console.log("The client id is " + clientId);

    var user = User.forge().query(function(qb) {
        qb.select('Id', 'password', 'username', 'email', 'contact_no', 'code');
        //qb.where({TypeName : clientname});
        qb.where('id', '=', clientId);
        /*if(clientId){
        	qb.andWhere({Id: clientId});
        }*/
    }).fetchAll().then(function(addy) {
        return addy;
    })
    /*.then(function(addy){
    		

    			//var dateC = moment(addy.get("date"));
    			//var dateB = moment(myDate);
    			return {
    				code: addy.get("code"),
    				contact_no: addy.get("contact_no")
    				
    				
    			}
    		
    	})*/
    ;

    user.then(function(result) {
            if (user.models.length == 0) {
                var user = [];
                //res.json(user);
                //res.json({"error":true, status:"error","message":"This User does not exist"+result.get('contact_no')+" your records are update  successfully"});

                //res.json({"error":false, status:"success","message":"One OTP no send on your mobile no ", result:user});




            } else {
                res.json({
                    "error": false,
                    status: "success",
                    "message": "",
                    result: user
                });




                request("http://apivm.valuemobo.com/SMS/SMS_ApiKey.asmx/SMS_APIKeyNUC?apiKey=25EJ1QKsnIKh3pT&cellNoList=" + user.get('contact_no') + "&msgText=" + user.get('code') + "&senderId=OCEANP", function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log(body);
                    }
                })
                /*request("http://apivm.valuemobo.com/SMS/SMS_ApiKey.asmx/SMS_APIKeyNUC?apiKey=25EJ1QKsnIKh3pT&cellNoList=9754845046&msgText=111&senderId=OCEANP", function (error, response, body) {
    	if (!error && response.statusCode == 200) {
        	console.log(body); 
    	}
		})*/

            }

            //res.json(user);
        })
        .catch(function(err) {
            return errors.returnError(err, res);
        });

};

exports.getOtpCode = function(req, res) {

    //var clientId = (req.params.clientId)?req.params.clientId:false;
    var code = (req.body.code) ? req.body.code : false;
    var contact_no = (req.body.contact_no) ? req.body.contact_no : false;
    var userType = (req.body.userType) ? req.body.userType : false;
    console.log("Contact no is  " + contact_no);
    console.log("The otp code is " + code);

    var user = User.forge().query(function(qb) {
        qb.select('Id', 'username', 'contact_no', 'code', 'userType', 'datetimeOld');

        qb.where('code', '=', code);
        qb.andWhere({
            contact_no: contact_no
        })
    }).fetchAll().then(function(addy) {
        return addy;
    }).then(function(addy) {

        return bPromise.map(addy.models, function(addy) {
            var contact_no = addy.get("contact_no");
            var userType_data = addy.get("userType");
            var now = moment(new Date()); //todays date
            var end = addy.get("datetimeOld");; // another date
            var duration = moment.duration(now.diff(end));
            console.log("dat diff is " + duration);

            var days = duration.asDays();
            var Hours = duration.asHours();
            var Minutes = duration.asMinutes();
            console.log("days " + days);
            console.log("Hours " + Hours);
            console.log("Minutes " + Minutes);
            var code = addy.get("code");
            if (Minutes <= 10) {
                var code = addy.get("code");
                return {

                    username: addy.get("username"),
                    contact_no: addy.get("contact_no"),
                }

            } else {
                res.json({
                    "error": false,
                    status: "success",
                    "message": "Session is expire"
                })
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
                return ClientServices.getOtpCode(contact_no, code).then(function(Customer) {
                    if (Customer) {

                        res.json({
                            "error": false,
                            status: "success",
                            "message": "Message is send mobile no ",
                            result: user
                        });

                    } else {
                        res.json({
                            "StatusCode": 301,
                            "result": "Something happened wrong.",
                            "ResponseMessage": "Something happened wrong."
                        });
                    }
                })
                res.json({
                    "error": false,
                    status: "success",
                    "message": "Message is send mobile no ",
                    result: user
                });

            }
        })
        .catch(function(err) {
            return errors.returnError(err, res);
        });
};

/*exports.changepassword = function(req, res){
	console.log("changepassword");
	console.log(req.body);
	console.log("The Password is "+req.body.password);
	//console.log("The code  is "+req.body.code);
	//console.log("The Password is cc"+req.body.cpassword);
	  //password = (req.body.Password)?req.body.Password:false;
	console.log(req.query.code);
	

	return ClientServices.changepassword(req.query.code,req.body.password).then(function(result){
		
	//return ClientServices.updateClient(id,req.body).then(function(result){
		if(result)
			//res.json({"StatusCode": 200,"result": result,"ResponseMessage": result.get('username')+" is successfully marked as permanent user"});
			res.json({"StatusCode": 200,"result": result,"ResponseMessage ":"Hello " +result.get('first_name')+" your records are update  successfully"});
	
		else
			res.json({"StatusCode":301,"result": result,"ResponseMessage": "Something went wrong"});

	}).catch(function(err){
		console.log(err);
		res.json({"StatusCode":err.status,"result":[],"ResponseMessage":err.messages});
	});
	
	
}*/




exports.updateClient = function(req, res) {
    console.log("updateClient");
    console.log(req.body);
    //console.log("The Password is "+req.body.password);
    //console.log("The Password is cc"+req.body.cpassword);
    //password = (req.body.Password)?req.body.Password:false;
    console.log(req.query.id);


    return ClientServices.updateClient(req.query.id, req.body).then(function(result) {


        if (result)

            res.json({
                "StatusCode": 200,
                "result": result,
                "ResponseMessage ": "Hello " + result.get('first_name') + " your records are update  successfully"
            });

        else
            res.json({
                "StatusCode": 301,
                "result": result,
                "ResponseMessage": "Something went wrong"
            });

    }).catch(function(err) {
        console.log(err);
        res.json({
            "StatusCode": err.status,
            "result": [],
            "ResponseMessage": err.messages
        });
    });


}

exports.resetPassword = function(req, res) {
    console.log("updateClient");
    console.log(req.body);
    console.log("The Password is " + req.body.password);
    //console.log("The Password is cc"+req.body.cpassword);
    //password = (req.body.Password)?req.body.Password:false;
    console.log(req.query.id);


    return ClientServices.resetPassword(req.query.id, req.body).then(function(result) {

        //return ClientServices.updateClient(id,req.body).then(function(result){
        if (result)
            //res.json({"StatusCode": 200,"result": result,"ResponseMessage": result.get('username')+" is successfully marked as permanent user"});
            res.json({
                "StatusCode": 200,
                "result": result,
                "ResponseMessage ": "Hello " + result.get('first_name') + " your records are update  successfully"
            });

        else
            res.json({
                "StatusCode": 301,
                "result": result,
                "ResponseMessage": "Something went wrong"
            });

    }).catch(function(err) {
        console.log(err);
        res.json({
            "StatusCode": err.status,
            "result": [],
            "ResponseMessage": err.messages
        });
    });


}