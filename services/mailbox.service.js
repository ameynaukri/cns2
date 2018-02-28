var config         = require('../config'),
    enquiry = require('../models/enquiry.model'),
    Users = require('../models/Users.model'),
    moment = require('moment'),
    moment_tz= require('moment-timezone'),
    Promise  = require("bluebird"),
    helperServices = require('../services/helper.service');
    var request = require('request');

    exports.getUserMailPass = function(id){
      return Users.forge().query(function(qb){
          qb.select('email','emailPass');
          qb.where('id',id);
      }).fetch().then(function(result){
          return result;
      }).catch(function(err){
        return err;
      })
    }

    exports.getMailboxdata = function(req,res,params,resolve, reject){
    //  console.log(params);
          var Options = params;
    return request.post({url:config.IMAP_PATH, 
            form: Options},function(err,httpResponse,body){ 
                if(err){
                    console.log("err");
                }else{
                  //console.log(httpResponse.body);
                 return res.json({"StatusCode": 200,"result": httpResponse.body,"ResponseMessage": ""});
                // return httpResponse.body;
                }
        
        //return true;
    }); 
    }
    exports.getClientemailIds = function(params){
            return Users.forge().query(function(qb){
                qb.select('email');
                if(params.userType == 'User')
                qb.where("userType",'Admin');
              if(params.userType == 'Admin')
                qb.where("userType",'User');
            }).fetchAll().then(function(result){
                return result;
            }).catch(function(err){
              return err;
            })
        
    }