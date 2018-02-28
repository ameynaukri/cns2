var config         = require('../config'),
	mailboxServices = require('../services/mailbox.service'),
	helperServices = require('../services/helper.service'),
	moment = require('moment'),
	moment_tz= require('moment-timezone'),
	Promise        = require("bluebird");

/*#######################
####GET ENQUIRY LIST###
#######################
Method:GET
Parameters:NONE
Success Output:
Failure Output:
#######################*/
exports.getMailboxdata = function(req, res){
	return mailboxServices.getUserMailPass(req.query.id).then(function(result){
		if(result){
				var data = {
					"email":result.get('email'),
					"password":result.get('emailPass')
				}
				/*return mailboxServices.getMailboxdata(data).then(function(result){
					if(result){
						res.json({"StatusCode": 200,"result": result,"ResponseMessage": result.get('userName')+" is successfully marked as permanent user"});
					}
					else{
						res.json({"StatusCode":301,"result": result,"ResponseMessage": "Something went wrong"});
					}

				}).catch(function(err){
					console.log(err);
					res.json({"StatusCode":err.status,"result":[],"ResponseMessage":err.messages});
				});*/
return new Promise(function(resolve, reject) {  
					            	resolve(mailboxServices.getMailboxdata(req,res,data,resolve, reject));
					            	/*console.log("dddd");
					            	console.log(mails);
					            	console.log("dddd");*/
					                    //resolve(helperServices.getnearbylocation(allorg,latlongarray,origins));
					            });






			console.log(result);
			/*console.log(result.get('email'));
			console.log(result.get('emailPass'));*/
			//res.json({"StatusCode": 200,"result": result,"ResponseMessage": result.get('userName')+" is successfully marked as permanent user"});
		}
		else{
			res.json({"StatusCode":301,"result": result,"ResponseMessage": "Something went wrong"});
		}

	}).then(function(d){
			console.log(d);
	}).catch(function(err){
		console.log(err);
		res.json({"StatusCode":err.status,"result":[],"ResponseMessage":err.messages});
	});
}

exports.getClientemailIds = function(req, res){
	console.log("getClientemailIds");
	return mailboxServices.getClientemailIds(req.query).then(function(data){
		if(data.length){
			var emailarray = [];
			return Promise.map(data.models,function(Client){
				 emailarray.push(Client.get("email"));
				 return Client.get("email");
			});
		}
		else{
			return [];
		}

	}).then(function(d){
		if(d.length>0)
			res.json({"StatusCode":200,"result": d,"ResponseMessage": ""});
		else
			res.json({"StatusCode":301,"result": d,"ResponseMessage": "Something went wrong"});
	}).catch(function(err){
		console.log(err);
		res.json({"StatusCode":err.status,"result":[],"ResponseMessage":err.messages});
	});
}