var crypto = require('crypto'),
    //fs = require("fs"),
    config = require('../config'),
    //CommentServices = require('../services/Comment.service'),
   // ReviewServices = require('../services/Review.service'),
    //distance = require('google-distance-matrix'),
    moment = require('moment');
    exports.decrypt = function(text,Email){
      var decipher = crypto.createDecipher('aes-256-cbc',Email);
      var dec = decipher.update(text,'base64','utf8');
      dec += decipher.final('utf8');
      return dec;
    }
    exports.encryption = function(text,Email){
      var cipher = crypto.createCipher('aes-256-cbc',Email);
      var crypted = cipher.update(text,'utf8','base64');
      crypted += cipher.final('base64');
      data = crypted;
      return data;
    }
/*exports.getDisplayTime = function(PostTime){
  var now = moment().format('YYYY-MM-DD HH:mm:ss') ;
  
  var now = moment(new Date()); //todays date
  var end = moment(PostTime); // another date
  var duration = moment.duration(now.diff(end));
  var days = duration.asDays();
  var Hours = duration.asHours();
  var Minutes = duration.asMinutes();
  var Seconds = duration.asSeconds();
  if(Math.round(days)>365){
      var years = (days / 365);
      if (days % 365 != 0)
          years += 1;
      if(years==1)
          var displayTime = Math.round( years ) + " year";
      else
          var displayTime = Math.round( years ) + " years";

      return displayTime;
  }
  if (Math.round(days) > 30){
                  var months = (days / 30);
                  if (days % 31 != 0)
                      months += 1;
                 if(months==1)
                      var displayTime = Math.round( months ) + " month";
                  else
                      var displayTime = Math.round( months ) + " months";
                  return displayTime;
  }
  if (Math.round(days) > 0){
      if(days==1)
          var displayTime = Math.round( days ) + " day";
      else
          var displayTime = Math.round( days ) + " days";
      return displayTime;
  }
   if(Math.round(Hours) > 0){
      if(Hours==1)
          var displayTime = Math.round( Hours ) + " Hour";
      else
          var displayTime = Math.round( Hours ) + " Hours";
      return displayTime;
   }              
  if(Math.round(Minutes) > 0){
    if(Minutes==1)
        var displayTime = Math.round( Minutes ) + " Minute";
    else
        var displayTime = Math.round( Minutes ) + " Minutes";
    return displayTime;
  }         
  if(Math.round(Seconds) > 5){
    if(Seconds==1)
        var displayTime = Math.round( Seconds ) + " Second";
    else
        var displayTime = Math.round( Seconds ) + " Seconds";
    return displayTime;
  }  
  if( Math.round(Seconds)<= 5){
        var displayTime = "just now";
        return displayTime;
  }
}*/

/*exports.base64toimage = function(dataString,section,resolve, reject){
   console.log("dataString");
    var min = 100000; 
    var max = 999999; 
    var name = Math.floor(Math.random() * (max - min + 1)) + min+".png";
    
    var folder = "Avatar";
    var filename=config.image_path+"Upload/"+folder+"/"+name;
    var path = "Upload/"+folder+"/"+name;
    fs.writeFile(filename, new Buffer(dataString, "base64"),function(err){
      if(err){
        console.log("err");
        console.log(err);
        console.log("err");
      } 
      else
      console.log("file uploaded successfully");
        resolve(path);
       // return path;
    });
};*/