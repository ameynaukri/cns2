var Customer = require('../models/user.model'),
    moment = require('moment');
var crypto = require('crypto');

function randomValueHex(len) {
    return crypto.randomBytes(Math.ceil(len / 2))
        .toString('hex') // convert to hexadecimal format
        .slice(0, len); // return required number of characters
}

var value1 = randomValueHex(12) // value 'd5be8583137b'
var value2 = randomValueHex(2) // value 'd9'

//console.log("the value 3 is "+sub);



exports.add = function(params) {
    var myDate = moment(new Date()).format("YYYY-MM-DD");
    var sub = randomValueHex(7) // value 'ad0fc8c'
    var Customers = new Customer({
        username: (params.username) ? params.username : null,
        contact_no: (params.contact_no) ? params.contact_no : null,
        password: (params.Pass) ? params.Pass : null,
        first_name: (params.first_name) ? params.first_name : null,
        email: (params.email) ? params.email : null,
        userType: (params.userType) ? params.userType : null,
        gender: (params.gender) ? params.gender : null,
        code: sub,
        date: myDate,

    });
    return Customers.save(null).tap(function(model) {
        CustomersData = model;
        return CustomersData;
    }).then(function(CustomersData) {
        return CustomersData;
    }).catch(function(err) {
        return err;
    });
};