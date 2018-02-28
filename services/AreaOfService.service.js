var config = require('../config'),
    // enquiry = require('../models/enquiry.model'),
    Area = require('../models/AreaOfService.model'),
    moment = require('moment'),
    moment_tz = require('moment-timezone'),
    Promise = require("bluebird"),
    helperServices = require('../services/helper.service');
var request = require('request');

/* var date =new Date(); 
 var wrapped = moment(new Date()); 
 console.log(wrapped); 

 var date = wrapped.toDate(); 
 console.log("today date"+date);
 console.log("Date by amey",date); 

 var date_moment =moment().format('YYYY-MM-DD HH:mm:ss');
 console.log("momaent use again by amey"+ date_moment)*/


/*exports.add = function(params){
  var area_of_service = new area_of_service({
      "location":(params.first_name)?params.first_name:false,
      "longitude":(params.longitude)?params.longitude:false,
      "latitude":(params.latitude)?params.latitude:false,
      "id":(params.middle_name)?params.middle_name:false
      
  });
 //moment().format('YYYY-MM-DD HH:mm:ss'),

  return area_of_serviceData.save(null).tap(function (model){
     area_of_serviceData = model;
      return area_of_serviceData;
    }).then(function(area_of_serviceData){
      return area_of_serviceData;
    }).catch(function(err){
      return err;
    });
};*/
exports.deleteArea = function(addParams) {
    //params.map(function(addParams) {
    return Area.forge().query(function(qp) {
        qp.where("area_id", addParams);
    }).fetch().then(function(model) {
        model.destroy().then(function(data) {
            console.log("deleted");
        });
    });
    //});
}

exports.add = function(params) {
    var area_of_serviceData = new Area({
        "location": (params.location) ? params.location : false,
        "area": (params.area) ? params.area : false,
        "longitude": (params.longitude) ? params.longitude : false,
        "latitude": (params.latitude) ? params.latitude : false,
        "id": (params.id) ? params.id : false
    });
    //moment().format('YYYY-MM-DD HH:mm:ss'),

    return area_of_serviceData.save(null).tap(function(model) {
        area_of_serviceData = model;
        return area_of_serviceData;
    }).then(function(area_of_serviceData) {
        return area_of_serviceData;
    }).catch(function(err) {
        return err;
    });
};