var User = require('../models/user.model');
var InstantMessage = require('../models/instanceMessage.model');
var clientOrganization = require('../models/clientOrganization.model');
var errorTypes = require('../errortypes');
var logger = require('../services/logger.service');
var BCrypt = require('bcrypt-nodejs');
var moment = require('moment');
var crypto = require('crypto');
var path = require('path');
var scriptName = path.basename(__filename);
var InstanceMessage = require('../models/instanceMessage.model');
organizationService = require('../services/orgenization.service');
var Promise        = require("bluebird");
var Appointment = require('../models/appointment.model');
/*exports.deleteAlluser = function() {
    return User.forge().query(function(qp){
      qp.del();
      qp.whereIn('TypeName', ["Client","AssistantTherapist"]);
    }).fetchAll();
}*/
exports.create = function(userParameters, transaction) {
  logger.debug(scriptName,'Creating user');

  var emailPromise = null;
  var authFetchParams = {};
  
  if (transaction) {
    authFetchParams.transacting = transaction;
  }

  emailPromise = new User({email: userParameters.Email}).fetch(authFetchParams);
  // return promise
  return emailPromise.then(function(model) {
    if(model) {
      var err = new errorTypes.AlreadyExistsError('user with email already exists');
      throw err;
    }
  })
  .then(function() {
    // TODO: Validate Password is good enough
    var isellitemember = (userParameters.IsEliteMember)?userParameters.IsEliteMember:0;
    var hash = BCrypt.hashSync(userParameters.Password);
    var signUpAuth = new User({
      TypeName: userParameters.TypeName, 
      FirstName: userParameters.FirstName, 
      LastName: userParameters.LastName,
      MobileNumber: userParameters.MobileNumber,
      Email: userParameters.Email,
      Password: hash,
      DOB: moment(userParameters.DOB).format('YYYY-MM-DD'),
      DOJ: moment().format('YYYY-MM-DD'),
      IsEliteMember : isellitemember,
      CreatedBy : userParameters.CreatedBy,
      Gender : userParameters.Gender,
      Uploaded_RMT_DocFileName : userParameters.Uploaded_RMT_DocFileName,
      platformId :'{"Web":[],"Android":[],"IOS":[],"loggedInCount":0}'
    });

    //return signUpAuth.save(null, authFetchParams);
    return signUpAuth.save(null).tap(function (model){
      id = model;
      return id;
    }).then(function(){
      return id;
    });
  });
};


//find user by email id
/*exports.usersfindByEmail = function(email){
    var fetchParams ={};

    return User.forge().query(function(qp){
      qp.where("Email", email);
    }).fetch(fetchParams);
};*/
exports.usersfindByEmail = function(email){
    var fetchParams = {
      withRelated: [
        'payment'
      ]
    };
    return User.forge().query(function(qp){
      qp.where("Email", email);
    }).fetchAll(fetchParams);
};

/// Find with related parameters, by Id
exports.find = function(userId, transaction) {
  var fetchParams = {};

  if (transaction) {
    fetchParams.transacting = transaction;
  }

  return User
    .forge({Id:userId})
    .fetch()
    .then(function(user){
      return user;
    }).catch(function(err) {
      throw new Error('Category not found');
    });
};


exports.getSocketwithoutLogin = function() {
  var fetchParams = {};

  return User
    .forge().query(function(qp){
      qp.select("Id", "CreatedBy", "FirstName", "organizationId", "isSocket");
      qp.where({isSocket: 0});
      qp.andWhere({loginSockte: 1});
    }).fetchAll(fetchParams);
};

/// Find with related parameters, by Id
exports.findByEmail = function(Email, transaction) {
  var fetchParams = {};

  if (transaction) {
    fetchParams.transacting = transaction;
  }
  return User
    .forge().query(function(qp){
        qp.where({Email:Email});
    })
    .fetch(fetchParams).then(function(data){
      return data;
    });
};

/// Find with related parameters, by Id
exports.checkonredudentemail = function(Email,userId, transaction) {
  var fetchParams = {};

  if (transaction) {
    fetchParams.transacting = transaction;
  }
  return User
    .forge().query(function(qp){
        qp.where("Email",Email);
        qp.andWhereNot("Id",userId);
    })
    .fetch(fetchParams).then(function(data){
      return data;
    });
};

/// Find with related parameters, by Id
exports.findByUserType = function(userId, transaction) {
  var fetchParams = {};

  if (transaction) {
    fetchParams.transacting = transaction;
  }

  return User
    .forge().query(function(qp){
      qp.where("TypeName", "AssistantTherapist");
      qp.andWhere("CreatedBy", userId);
    })
    .fetchAll(fetchParams);
};


exports.getInfo = function(UserId, key){
  return User.forge().query(function (qb) {
    qb.select('Id', 'FirstName', 'LastName', 'Email', 'MobileNumber', 'CreatedBy', 'IsEliteMember', 'DOJ', 'DOB', 'Gender', 'UserImage');
    if(UserId){
      switch(key){
        case 'appo':
          qb.where({CreatedBy: UserId});
          break;
        case 'remind':
          qb.where({Id: UserId});
          break;
      }
    }
  }).fetchAll();
}

exports.checkPassword = function(UserId, password){
  //console.log(password);
  //var hash = BCrypt.hashSync(password);
  //console.log(hash);
  return User.forge().query(function (qb) {
    qb.select('Id', 'Password');
    if(UserId){
      qb.where({Id:UserId});
    }
  }).fetchAll().then(function(pass){
    var hash = pass.models[0].attributes.Password; 
    if(BCrypt.compareSync(password, hash) == true){
      return 1;
    } else {
      return 0;
    }; 
  });
}

exports.checkIsCorrectUser = function(fUser, authId) {
  /// Checks for correct user.
  /// Throws error is user is not found or has wrong id.
  if(!fUser) {
    logger.warn(scriptName, 'user not found');
    throw new Error('User not found');
    
  }
  return true;
};

exports.update = function(userId, userParameters, transaction) {
  logger.debug(scriptName,'Updating user');

  var authUpdateParams = {
    patch:true
  };
  var authFetchParams = {};

  if (transaction) {
    authUpdateParams.transacting = transaction;
    authFetchParams.transacting = transaction;
  }

  var foundUser = User.forge({id: userId});

  return foundUser
    .fetch(authFetchParams)
    .then(function(fUser) {
      return fUser.save(userParameters, authUpdateParams);
    });
};


exports.changePassword = function(userId, updateUserPassParams, transaction){
  logger.debug(scriptName,'Updating');

  var authUpdateParams = {
    patch:true
  };
  var authFetchParams = {};

  if (transaction) {
    authUpdateParams.transacting = transaction;
    authFetchParams.transacting = transaction;
  }

  var foundUser = User.forge({id: userId});

  return foundUser
    .fetch(authFetchParams)
    .then(function(fUser) {
      return fUser.save(updateUserPassParams, authUpdateParams);
    });
};

exports.email = function(userID, transaction){
  
  logger.debug(scriptName,'Updating');
 // var DAY_TO_EXPIRE = 3;
 var HOURS_TO_EXPIRE = 2;
 
  var authUpdateParams = {
    patch:true
  };
  var authFetchParams = {};

  if (transaction) {
    authUpdateParams.transacting = transaction;
    authFetchParams.transacting = transaction;
  }

  var foundUser = User.forge({id: userID});
  return foundUser
    .fetch(authFetchParams)
    .then(function(fUser) {
      return fUser.save({
          resetpasswordtoken: crypto.randomBytes(3).toString('hex'),
          //resetpasswordexpirationdate: moment().add(DAY_TO_EXPIRE, 'days').format()
          resetpasswordexpirationdate: moment().add(HOURS_TO_EXPIRE, 'h').format("YYYY-MM-DD HH:mm:ss")
      }, authUpdateParams);
    });

};

/// Find with related parameters, by Id
exports.emailFind = function(userEmail, transaction) {
  var fetchParams = {};

  if (transaction) {
    fetchParams.transacting = transaction;
  }

  return User
    .forge({Email:userEmail})
    .fetch(fetchParams);
};


exports.keywordClient = function(keyword, UserId, transaction){
  var fetchParams = {};
  var resultArray = [];
  if (transaction) {
    fetchParams.transacting = transaction;
  }

  var user = User
    .forge().query(function(qp){
      qp.select('Id');
      qp.where({CreatedBy:UserId});
      qp.andWhere('FirstName', keyword);
    }).fetchAll(fetchParams).then(function(addy) {
      return addy;
    });

  return user.then(function (appo) {
    if(appo.models.length == 0){
      var meal = [];
      return meal;
    };
    
    appo.map(function(addParams) {
      var insertString = addParams.get('Id');
      console.log(insertString);
      resultArray.push(insertString);
    });
    return resultArray;
  });
};


exports.getMessagesCount= function(OrgId, userId){
  var result = [];
  return User.forge().query(function(qp){
          qp.select('User.Id', 'User.TypeName', 'User.Firstname', 'User.LastName', 'User.isSocket','User.IsLoggedIn','User.UserImage','User.Email' );
          qp.sum('InstantMessage.is_not_read AS messageCount');
          
          qp.leftJoin('InstantMessage',function(){
              this.on('User.Id', '=', 'InstantMessage.MessageBy') //.andOn('InstantMessage.MessageTo', '=', userId)
          });
          qp.where(function(){
              this.where('User.organizationId',OrgId).andWhereNot('User.organizationId', 0).andWhereNot('User.Id',userId).whereIn('User.TypeName',['Therapist','AssistantTherapist'])
          });
          qp.where('InstantMessage.MessageTo', '=', userId);
          qp.groupBy('User.Id');
  }).fetchAll().then(function(finalResult){
          var DepricatedIds =[];
          finalResult.forEach(function(s) {
            s.attributes.FullName = s.attributes.Firstname+" "+s.attributes.LastName;
            DepricatedIds.push(s.attributes.Id);
            result.push(s);
          });
          return User.forge().query(function(qp){
              qp.select('Id', 'TypeName', 'Firstname', 'LastName', 'isSocket','IsLoggedIn','UserImage','Email' );
              qp.where(function(){
                this.where('organizationId',OrgId).andWhereNot('organizationId', 0).andWhereNot('Id',userId).whereIn('TypeName',['Therapist','AssistantTherapist'])
              }).whereNotIn('Id',DepricatedIds );
              /*qp.orWhere(function(){
                this.where("loginSockte", 1).andWhere("isSocket", 0);
              }).whereNotIn('Id',DepricatedIds );;*/
          }).fetchAll().then(function(alluserlist){
              alluserlist.forEach(function(s) {
                s.attributes.messageCount = 0;
                s.attributes.FullName = s.attributes.Firstname+" "+s.attributes.LastName;
                result.push(s);
              });
              
              return result;
          })
  });
};

exports.findAllThereapist = function(userType,action){
  var fetchParams ={};
  var now = new Date();
  return User
    .forge().query(function(qp){
      qp.where("TypeName", "Therapist");
      if(action)
      qp.where("viewed", 0);
    })
    .fetchAll(fetchParams);
};

exports.findClientsThereapisttrial = function(client_id){
  var fetchParams = {};
 
  return User.forge().query(function(qb){
      qb.select('IsActive','LastName','TypeName','MobileNumber','DOJ','Email','packageId','organizationId','UserImage');

      qb.where(function(){
          this.whereIn('organizationId', this.select("organization_id").where("client_id", client_id).from("clientOrganization"))
       });
  }).fetchAll().then(function(Therapistlist){
      return Therapistlist;
  });
};
exports.findClientsThereapist = function(client_id){
  var fetchParams = {};
 
  return clientOrganization.forge().query(function(qb){
      qb.select('owner_id');

      qb.where(function(){
          this.where("client_id", client_id);
       });

  }).fetchAll().then(function(organaizationIds){
      return organaizationIds;
  }).then(function(organaizationIds){
        var orgId = [];

        organaizationIds.forEach(function(s) {
              if(orgId.indexOf(s.attributes.owner_id) == -1)
              orgId.push(s.attributes.owner_id);
        });
        return orgId;
  }).then(function(orgId){
      return User.forge().query(function(qb){
          qb.select('Id','FirstName', 'LastName', 'Email', 'MobileNumber', 'CreatedBy', 'IsEliteMember', 'DOJ', 'DOB', 'Gender', 'UserImage', 'language','TypeName');
          qb.where(function(){
                this.whereIn("Id", orgId);
            });
      }).fetchAll().then(function(TherapistList){
          return TherapistList;
      })

  });
};

//new service by sitara starts here 29sept 2016
exports.findClientsThereapistforOrg = function(organizationID,client_id){
  var fetchParams = {withRelated: [
        'TherapistDetails'
      ]};
  var therapistId =[];
  var result = [];
  return Appointment.forge().query(function(qb){
            qb.where("AppointmentForPatient", client_id)
      }).fetchAll(fetchParams).then(function(addy){
          if(addy.length == 0){
              return therapistId;
          } else {
              Promise.map(addy.models, function (response) {
                var id =response.relations.TherapistDetails.get('Id');
                   therapistId.push(id)
              });
              return therapistId;
      }
      }).then(function(response){
            if(response.length){
                return User.forge().query(function(qb){
                    qb.select('User.Id', 'User.TypeName', 'User.Firstname', 'User.LastName', 'User.isSocket','User.IsLoggedIn','User.UserImage');
                    qb.sum('InstantMessage.is_not_read AS messageCount');

                    qb.leftJoin('InstantMessage',function(){
                      this.on('User.Id', '=', 'InstantMessage.MessageBy') //.andOn('InstantMessage.MessageTo', '=', userId)
                    });
                    qb.where(function(){
                      this.where('User.organizationId',organizationID).whereIn('User.Id',response)
                    });
                    qb.where('InstantMessage.MessageTo', '=', client_id);
                    qb.groupBy('User.Id');
                }).fetchAll().then(function(TherapistList){
                    return TherapistList;
                })
              }else{
                  return []; 
              }
      }).then(function(finalResult){
        var DepricatedIds =[];
        if(finalResult.length){
            finalResult.forEach(function(s) {
              DepricatedIds.push(s.attributes.Id);
              result.push(s);
            });
        }
          
          return User.forge().query(function(qp){
              qp.select('Id', 'TypeName', 'Firstname', 'LastName', 'isSocket','IsLoggedIn','UserImage' );
              qp.where(function(){
                this.where('User.organizationId',organizationID).whereIn('User.Id',therapistId)
              }).whereNotIn('Id',DepricatedIds );
          }).fetchAll().then(function(alluserlist){
              alluserlist.forEach(function(s) {
                s.attributes.messageCount = 0;
                result.push(s);
              });
              
              return result;
          })

      }).catch(function(err) {
          console.log(err);
      });
};

exports.findClientsforChat = function(TypeName, UserId, orgId){
/*  console.log(TypeName);
  console.log(UserId);
  console.log(orgId);*/
  var result = [];
 return User.forge().query(function (qb) {
    qb.select('User.Id', 'User.TypeName', 'User.Firstname', 'User.LastName', 'User.isSocket','User.IsLoggedIn','User.UserImage','User.Email' );
    qb.sum('InstantMessage.is_not_read AS messageCount');
   /* qb.innerJoin('clientOrganization', function() {
      this.on('clientOrganization.client_id', '=', 'User.Id')
    })*/
    qb.leftJoin('InstantMessage',function(){
      this.on('User.Id', '=', 'InstantMessage.MessageBy') 
    });

    qb.where({'User.TypeName' : 'Client'});
    if(UserId){
      //qb.andWhere({'clientOrganization.organization_id': orgId});
      /*if(TypeName=="AssistantTherapist")
      qb.andWhere({'clientOrganization.owner_id': UserId});*/
      qb.orderBy('User.FirstName');
    }
    qb.where('InstantMessage.MessageTo', '=', UserId);
    qb.groupBy("User.Id");
    
  }).fetchAll().then(function(finalResult) {
       var DepricatedIds =[];
       if(finalResult.length){
            finalResult.forEach(function(s) {
              s.attributes.messageCount = s.attributes.messageCount;
              s.attributes.FullName = s.attributes.Firstname+" "+s.attributes.LastName;
              DepricatedIds.push(s.attributes.Id);
              result.push(s);
            });
       }
       return User.forge().query(function (qb) {
   	 	qb.select('User.Id', 'User.TypeName', 'User.Firstname', 'User.LastName', 'User.isSocket','User.IsLoggedIn','User.UserImage','User.Email');
    		qb.innerJoin('clientOrganization', function() {
      		this.on('clientOrganization.client_id', '=', 'User.Id')
    	})

    qb.where({'User.TypeName' : 'Client'});
    if(UserId){
      qb.andWhere({'clientOrganization.organization_id': orgId});
      if(TypeName=="AssistantTherapist")
      qb.andWhere({'clientOrganization.owner_id': UserId});
      qb.orderBy('User.FirstName');
    }
     qb.whereNotIn('User.Id',DepricatedIds );
    qb.groupBy("User.Id");
  }).fetchAll().then(function(alluserlist){
              alluserlist.forEach(function(s) {
                s.attributes.messageCount = 0;
                s.attributes.FullName = s.attributes.Firstname+" "+s.attributes.LastName;
                result.push(s);
              });
              
              return result;
  })
  }).catch(function(err) {
          console.log(err);
      });
}
  //new service by sitara ends here 29sep 2016


exports.findpaymentlist = function(userId){
  var fetchParameters = {
    withRelated : [
      'payment'
    ]
  };
  return User.forge().query(function(qb){
    qb.where("TypeName", "Therapist");
    if(userId)
    qb.where("Id", userId);
  }).fetchAll(fetchParameters);
}

exports.userReportList = function(now,oneYr){
    var fetchParameters = {};
    return User.forge().query(function(qb){
        qb.select('User.Id as userId','User.FirstName','User.IsActive','User.LastName','User.TypeName','User.MobileNumber','User.DOJ','User.Email','User.packageId','User.organizationId','User.UserImage');
        qb.sum('Payment.Amount AS TotalPayment');
        qb.leftJoin('Payment',function(){
            this.on('User.Id', '=', 'Payment.UserId')
        });
        qb.where(function(){
            this.where('Payment.payment_date','<', moment(now).format('YYYY-MM-DD h:mm:ss')).orWhere('Payment.payment_date', moment(now).format('YYYY-MM-DD h:mm:ss'))
        }).andWhere('Payment.payment_date','>', moment(oneYr).format('YYYY-MM-DD h:mm:ss'));
        qb.groupBy('User.Id');
    }).fetchAll().then(function(reportlist){
        return reportlist;
    })
}

exports.getdashboardSubscriber = function(){
    var now = new Date();
      datefromYear= now.getFullYear();
      datefromMonth=1;
      datefromDate=1;
      newdatefrom =datefromMonth+"/"+datefromDate +"/"+datefromYear;
      newdatefrom = new Date(newdatefrom);
      return User.forge().query(function(qb){
            qb.select('Id','DOJ');
            qb.where(function(){
              this.where('User.DOJ','>', moment(newdatefrom).format('YYYY-MM-DD h:mm:ss')).orWhere('User.DOJ', moment(newdatefrom).format('YYYY-MM-DD h:mm:ss'))
            }).andWhere("TypeName", "Therapist");
      }).fetchAll().then(function(UserList){
            var userArray = [{"Month":'Jan',"Subscription":0},{"Month":'Feb',"Subscription":0},{"Month":'Mar',"Subscription":0},{"Month":'Apr',"Subscription":0},{"Month":'May',"Subscription":0},{"Month":'Jun',"Subscription":0},{"Month":'Jul',"Subscription":0},{"Month":'Aug',"Subscription":0},{"Month":'Sep',"Subscription":0},{"Month":'Oct',"Subscription":0},{"Month":'Nov',"Subscription":0},{"Month":'Dec',"Subscription":0}];
            var data = {
                'Month':'',
                'Suscriber':[]
              }
             UserList.forEach(function(s) {
              
                monthnumber = moment(s.attributes.DOJ).format('M') - 1;
                console.log(monthnumber);
                console.log(userArray[monthnumber].Month);
                userArray[monthnumber].Month = moment(s.attributes.DOJ).format('MMM');
                console.log(userArray[monthnumber].Month);//parseInt("10")
                userArray[monthnumber].Subscription = parseInt(userArray[monthnumber].Subscription) + 1;
               /* userArray[monthnumber].Month = moment(s.attributes.DOJ).format('MMM');
                userArray[monthnumber].Suscriber.push(s.attributes.Id);*/
              });
             return userArray;
      }).then(function(final){
        return final;
      });
};

exports.getOrgnizationmembers = function(OrgId,userId){
         /* var registration_id = [];
          return User.forge().query(function(qp){
              qp.select('RegistrationId');
              qp.where(function(){
                this.where('organizationId',OrgId).andWhereNot('organizationId', 0).andWhereNot('Id',userId).whereIn('TypeName',['Therapist','AssistantTherapist'])
              });
          }).fetchAll().then(function(alluserlist){
               if(alluserlist.length)
              alluserlist.forEach(function(s) {
                    registration_id.push(s.attributes.RegistrationId);
              });
              return registration_id;
          }).then(function(ids){
                return User.forge().query(function(qb){
                      qb.select('User.RegistrationId');
       
                      qb.join('clientOrganization',function(){
                          this.on('clientOrganization.client_id', '=', 'User.Id')
                      });
                      qb.where(function(){
                        this.where("clientOrganization.organization_id", OrgId);
                      });
                }).fetchAll().then(function(UserList){
                      if(UserList.length)
                      UserList.forEach(function(s) {
                        
                        registration_id.push(s.attributes.RegistrationId);
                      });
                      return registration_id;
                });
          });*/
          var registration_id = [];
          var user_id = [];
          return User.forge().query(function(qp){
              qp.select('RegistrationId','FirstName','LastName');
              qp.where(function(){
                this.where('organizationId',OrgId).andWhereNot('organizationId', 0).andWhereNot('Id',userId).whereIn('TypeName',['Therapist','AssistantTherapist'])
              });
          }).fetchAll().then(function(alluserlist){
               if(alluserlist.length)
              alluserlist.forEach(function(s) {
                          //trial
                          var parsedobjectfirstname = s.attributes.FirstName;
                          var parsedobjectlastname = s.attributes.LastName;
                          var fullname = parsedobjectfirstname +" "+parsedobjectlastname;
                          user_id.push(fullname);
                          //trial
                    if(s.attributes.RegistrationId){
                      var parsedObj =JSON.parse(s.attributes.RegistrationId);
                      registration_id.push(parsedObj.registrationIds);
                    }
                    
              });
              return registration_id;
          }).then(function(ids){
                return User.forge().query(function(qb){
                      qb.select('User.RegistrationId','User.FirstName','User.LastName');
       
                      qb.join('clientOrganization',function(){
                          this.on('clientOrganization.client_id', '=', 'User.Id')
                      });
                      qb.where(function(){
                        this.where("clientOrganization.organization_id", OrgId);
                      });
                }).fetchAll().then(function(UserList){
                      if(UserList.length)
                      UserList.forEach(function(s) {
                         //trial
                          var parsedobjectfirstname = s.attributes.FirstName;
                          var parsedobjectlastname = s.attributes.LastName;
                          var fullname = parsedobjectfirstname +" "+parsedobjectlastname;
                          user_id.push(fullname);
                          //trial
                        if(s.attributes.RegistrationId){
         		    var f_client_array =[];
                            var parsedObjclient =JSON.parse(s.attributes.RegistrationId);
                            if(parsedObjclient.registrationIds.length>0){
                                parsedObjclient.registrationIds.forEach(function(i){
                                  if (registration_id.indexOf(i)==-1){
                                    f_client_array.push(i);
                                  }
				});
                                registration_id.push(f_client_array);
                              }
                           /* var parsedObjclient =JSON.parse(s.attributes.RegistrationId);
                            registration_id.push(parsedObjclient.registrationIds);*/
                        }
                      });
                      //console.log("user_id================================================");
                     // console.log(registration_id);
                      return registration_id;
                });
          });
}
//select * from Payment where `payment_date` > '2015-08-22' 
