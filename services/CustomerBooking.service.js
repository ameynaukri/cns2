var Customer = require('../models/Products.model'),
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




exports.update_status = function(id) {
    console.log("id on service page" + id);
    var status = 1;
    params = status;
    params = {
        "status": status
    }
    var updateParams = {
        patch: true
    }
    var data = params;
    return Customer.forge().query(function(qb) {
        qb.where('id', id);
        // qb.andWhere({'status':  0});  
    }).fetchAll().then(function(products) {

        products.forEach(function(Customer) {

            //console.log(products);
            return Customer.save(data, updateParams);

        });

    }).catch(function(err) {
        console.log(err);
        return err;
    });

}