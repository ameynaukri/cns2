var config = require('../config'),
    User = require('../models/user.model'),
    CustomerServices = require('../services/Customer.service'),
    helperServices = require('../services/helper.service'),
    moment = require('moment'),
    fs = require("fs"),
    bPromise = require("bluebird"),
    orm = require('../orm');

var multer = require('multer');
var files_Array = [];
var CustomerId;
//app.use(bodyParser.json());
/*var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  fileFirstName: function (req, file, callback) {
    console.log(file.mimetype);
    console.log(file.mimetype.split("/"));
    var mimetype = file.mimetype.split("/");
    var FirstName = (req.params.file)?req.params.file:false;
    CustomerId = (req.body.id)?req.body.id:false;
    if(FirstName){
        var filen = FirstName+".mp3";
    }
    else{
        var filen = file.fieldFirstName + '-' + Date.now();
    }
    files_Array.push(filen);
    callback(null, filen);
  }
});

var upload = multer({ storage : storage }).array('file',1);
var uploadvfile = multer({ storage : storage }).array('file',2);*/

/*Get all categories*/
var d = Date.now();
var sub = (d - 14879186);

console.log("the date is " + sub);
exports.add = function(req, res) {
    console.log("add Customer");
    var username = (req.body.username) ? req.body.username : false;
    var contact_no = (req.body.contact_no) ? req.body.contact_no : false;
    var Pass = (req.body.Pass) ? req.body.Pass : false;
    var first_name = (req.body.first_name) ? req.body.first_name : false;
    var email = (req.body.email) ? req.body.email : false;
    var userType = (req.body.userType) ? req.body.userType : false;
    var gender = (req.body.gender) ? req.body.gender : false;
    //var code = (req.body.code)?req.body.code:code;

    var user = User.forge().query(function(qb) {
        qb.select('Id', 'password', 'username', 'email', 'contact_no', 'code', 'userType');

        qb.where('username', '=', username);
        qb.orWhere({
            contact_no: contact_no
        })
        //qb.orWhere({userType:  userType})
        qb.orWhere({
            email: email
        })

    }).fetchAll().then(function(addy) {
        return addy;
    }).then(function(addy) {

        return bPromise.map(addy.models, function(addy) {})
    });

    user.then(function(user) {
            if (user.length == 0) {
                return CustomerServices.add(req.body).then(function(Customer) {
                    if (Customer)
                        res.json({
                            "StatusCode": 200,
                            "result": Customer,
                            "ResponseMessage": "New Customer created successfully!"
                        });
                    else
                        res.json({
                            "StatusCode": 301,
                            "result": "Something happened wrong.",
                            "ResponseMessage": "Something happened wrong."
                        });
                })
                var user = [];
                res.json({
                    "error": false,
                    status: "success",
                    "message": "User mobile no is not registered",
                    result: user
                });
            } else {

                res.json({
                    "error": false,
                    status: "success",
                    "message": "User is already exists"
                });
            }
        })
        .catch(function(err) {
            return errors.returnError(err, res);
        });
};