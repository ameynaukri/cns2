var Customer = require('../models/Booking.model'),
    User = require('../models/user.model'),
    Parking = require('../models/Parking.model'),
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

    var monthNames = ["January", "February", "March", "April", "May",
        "June", "July", "August", "September",
        "October", "November", "December"
    ];

    var d = new Date();
    day_value = d.getDate();
    month_value = monthNames[d.getMonth()];
    year_value = d.getFullYear();
    var my_date_is = "" + day_value + "-" + month_value + "-" + year_value;
    console.log("Today complete date is now " + my_date_is);
    //var myDate =  moment(new Date()).format("YYYY-MM-DD");
    var date_time = new Date();
    var sub = randomValueHex(7) // value 'ad0fc8c'
    var parking_price = (params.parking_price) ? params.parking_price : null;
    var duration = (params.duration) ? params.duration : null;
    var vehicle_type = (params.vehicle_type) ? params.vehicle_type : null;
    var parking_id = (params.parking_id) ? params.parking_id : null;
    var total_price = parking_price * duration;
    var Customers = new Customer({

        parking_id: (params.parking_id) ? params.parking_id : null,
        vehicle_type: vehicle_type,
        parking_owner_id: (params.parking_owner_id) ? params.parking_owner_id : null,
        customer_id: (params.customer_id) ? params.customer_id : null,
        parking_price: total_price,
        duration: (params.duration) ? params.duration : null,
        time: (params.time) ? params.time : null,
        place: (params.place) ? params.place : null,
        parking_status: 0,
        date: my_date_is,
        date_time: date_time,

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

exports.check_validity = function(booking_id) {

    var status = 1;
    params = status;
    params = {
        "parking_status": status
    }
    var updateParams = {
        patch: true
    }
    var data = params;
    return Customer.forge().query(function(qb) {
        qb.where('booking_id', booking_id);
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