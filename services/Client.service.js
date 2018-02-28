var config = require('../config'),
    enquiry = require('../models/enquiry.model'),
    Users = require('../models/Users.model'),
    moment = require('moment'),
    moment_tz = require('moment-timezone'),
    Promise = require("bluebird"),
    helperServices = require('../services/helper.service');
var request = require('request');




exports.getClientList = function(params) {
    var fetchParams = {
        withRelated: [
            'completedDealsCount'
        ]
    };
    return Users.forge().query(function(qb) {
        //qb.where('userType', 'User');

        // qb.where('isPermanent', params.isPermanent);
        qb.orderBy('id', 'desc');
    }).fetchAll(fetchParams).then(function(result) {
        return result;
    }).catch(function(err) {
        console.log(err);
        return err;
    });
}

exports.code_update = function(contact_no, code) {
    var code = (code) ? code : false;

    var datetimeOld = new Date();

    params = {
        "datetimeOld": datetimeOld,
        "code": code
    }
    var updateParams = {
        patch: true
    }
    //var decryptedPass = helperServices.encryption(password);
    var data = params;
    return Users.forge().query(function(qb) {
        qb.where('contact_no', contact_no);
    }).fetch().then(function(user) {
        return user.save(data, updateParams);
    }).catch(function(err) {
        console.log(err);
        return err;
    });

}

exports.code_update = function(contact_no, code) {
    var code = (code) ? code : false;

    var datetimeOld = new Date();

    params = {
        "datetimeOld": datetimeOld,
        "code": code
    }
    var updateParams = {
        patch: true
    }
    //var decryptedPass = helperServices.encryption(password);
    var data = params;
    return Users.forge().query(function(qb) {
        qb.where('contact_no', contact_no);
        qb.orWhere({
            email: contact_no
        })
    }).fetch().then(function(user) {
        return user.save(data, updateParams);
    }).catch(function(err) {
        console.log(err);
        return err;
    });

}

exports.getOtpCode = function(contact_no, code) {

    var code = (code) ? code : false;
    console.log("The contact no on service page is " + contact_no);

    params = {
        "code": code
    }
    var updateParams = {
        patch: true
    }

    var data = params;
    return Users.forge().query(function(qb) {
        qb.where('contact_no', contact_no);
        qb.orWhere({
            email: contact_no
        })

    }).fetch().then(function(user) {

        return user.save(data, updateParams);

    }).catch(function(err) {
        console.log(err);
        return err;
    });

}


exports.enter_new_password = function(code, contact_no, newpassword) {
    // var id = (id)?id:false;
    var code = (code) ? code : false;
    var contact_no = (contact_no) ? contact_no : false;
    var password = (newpassword) ? newpassword : false;

    params = password;
    params = {
        "password": password
    }

    //exports.updateClient =function(id, params){
    var updateParams = {
        patch: true
    }

    var data = params;
    return Users.forge().query(function(qb) {
        // qb.where('code',code);
        qb.where('code', code);
        // qb.andWhere('contact_no',contact_no);

    }).fetch().then(function(user) {
        if (user)
            return user.save(data, updateParams);
        else
            return false;
    }).catch(function(err) {
        console.log(err);
        return err;
    });

}

exports.resetpassword_step_one = function(id, currentpassword, newpassword) {
    var id = (id) ? id : false;
    var currentpassword = (currentpassword) ? currentpassword : false;
    var password = (newpassword) ? newpassword : false;

    params = password;
    params = {
        "password": password
    }

    //exports.updateClient =function(id, params){
    var updateParams = {
        patch: true
    }

    var data = params;
    return Users.forge().query(function(qb) {
        qb.where('id', id);
        qb.andWhere('password', currentpassword);

    }).fetch().then(function(user) {
        if (user)
            return user.save(data, updateParams);
        else
            return false;
    }).catch(function(err) {
        console.log(err);
        return err;
    });

}

exports.updateClient = function(id, params) {
    var updateParams = {
        patch: true
    }

    var data = params;
    return Users.forge().query(function(qb) {
        qb.where('id', id);

    }).fetch().then(function(user) {
        return user.save(data, updateParams);
    }).catch(function(err) {
        console.log(err);
        return err;
    });

}


//exports.resetpassword_step_one =function(clientId,oldpassword,password, params){


/*exports.changepassword =function(code, params){
  var updateParams = {
    patch : true
  }
   
  var data = params;
  return Users.forge().query(function(qb){
      qb.where('code',code);
  }).fetch().then(function(user){
    return user.save(data, updateParams);
  }).catch(function(err){
    console.log(err);
    return err;
  });

}*/


exports.resetPassword = function(id, params) {
    var updateParams = {
        patch: true
    }
    //var decryptedPass = helperServices.encryption(password);
    var data = params;
    return Users.forge().query(function(qb) {
        qb.where('id', id);
    }).fetch().then(function(user) {
        return user.save(data, updateParams);
    }).catch(function(err) {
        console.log(err);
        return err;
    });

}
/*exports.resetPassword =function(id, params){
  var updateParams = {
    patch : true
  }
   //var decryptedPass = helperServices.encryption(password);
  var data = params;
  return Users.forge().query(function(qb){
      qb.where('id',id);
  }).fetch().then(function(user){
    return user.save(data, updateParams);
  }).catch(function(err){
    console.log(err);
    return err;
  });

}*/

/*return new user({Id:UserID}).save({
        password: decryptedPass
      }, authUpdateOptions);*/