var config = require('./config');
var user = require('./models/user.model');
var LocalStrategy = require('passport-local').Strategy;
var helperServices = require('./services/helper.service')
var Passport = require('passport');
var request = require('request');

//Serialization
Passport.serializeUser(function(user, done) {
  console.log(user);
  done(null, user.id);
});

Passport.deserializeUser(function(userId, done) {

   new user({id: userId}).fetch().then(function(user) {
      done(null, user.toJSON());
   });
});

//Strategies
Passport.use(new LocalStrategy({usernameField:'username'},function(username, password, done) {
 
   new user({username: username }).fetch().then(function(data) {
      var authInfo = data;
      if(authInfo === null) {
        return done(null, false, {error : true, statusCode : 201});
      } else {
          authInfo = data.toJSON();
          password_plaintext = password
          console.log("The passsword id "+password);
          console.log("The user type "+usertype);
        if(password_plaintext!= authInfo.password || usertype != authInfo.userType) {
            return done(null, false, {error : true, statusCode : 202});
         } else {


            data = {
            "username": authInfo.username,
            "userType":authInfo.userType,
            "id": authInfo.id,
            "password": authInfo.password,
            "email": authInfo.email,
            "address": authInfo.address,
            "first_name": authInfo.first_name,
            "middle_name": authInfo.middle_name,
            "last_name": authInfo.last_name,
            "userType": authInfo.userType,
            "contact_no": authInfo.contact_no,
            "time": authInfo.time,
            "shop_name": authInfo.shop_name,
            "area_of_services": authInfo.area_of_services
            }
     /* request("http://apivm.valuemobo.com/SMS/SMS_ApiKey.asmx/SMS_APIKeyNUC?apiKey=25EJ1QKsnIKh3pT&cellNoList=" +authInfo.contact_no+"&msgText=" +authInfo.contact_no+"&senderId=OCEANP", function (error, response, body) {
      if (!error && response.statusCode == 200){
          console.log(body); 
      }
    })*/




            return done(null, data);
         }
      }
   });
}));

module.exports = Passport;

    