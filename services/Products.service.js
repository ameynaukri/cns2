var Products = require('../models/Products.model'),
    User = require('../models/user.model'),
    Booking = require('../models/Booking.model'),
    //setting = require('../models/setting.model'),
    //helperServices = require('../services/helper.service'),
    moment = require('moment'),
    moment_tz = require('moment-timezone'),
    Promise = require("bluebird"),
    helperServices = require('../services/helper.service');

exports.getDistance = function(start, end, decimals) {
    decimals = decimals || 2;
    var earthRadius = 6371; // km
    lat1 = parseFloat(start.latitude);
    lat2 = parseFloat(end.latitude);
    lon1 = parseFloat(start.longitude);
    lon2 = parseFloat(end.longitude);


    var dLat = (lat2 - lat1).toRad();
    var dLon = (lon2 - lon1).toRad();
    var lat1 = lat1.toRad();
    var lat2 = lat2.toRad();
    /*    console.log("===============================");
    console.log(start);
    console.log(end);
    console.log("===============================");*/
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = earthRadius * c;
    return Math.round(d * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

if (typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    }
}




exports.add = function(params) {
    var ProductsData = new Products({
        "product_title": (params.product_title) ? params.product_title : false,
        "product_name": (params.product_name) ? params.product_name : false,
        "product_description": (params.product_description) ? params.product_description : false,
        "product_quantity": (params.product_quantity) ? params.product_quantity : false,
        "product_weight": (params.product_weight) ? params.product_weight : false,
        "task_type": (params.task_type) ? params.task_type : false,
        "status": (params.status) ? params.status : 0,
        "customer_id": (params.customer_id) ? params.customer_id : false,
        "date": (params.date) ? params.date : false,

    });


    return ProductsData.save(null).tap(function(model) {
        ProductsData = model;
        return ProductsData;
    }).then(function(ProductsData) {
        return ProductsData;
    }).catch(function(err) {
        return err;
    });
};

exports.accept_product = function(id) {

    var status = 1;
    params = status;
    params = {
        "status": status
    }
    var updateParams = {
        patch: true
    }
    var data = params;
    return Booking.forge().query(function(qb) {
        qb.where('customer_id', id);
        // qb.andWhere({'status':  0});  
    }).fetchAll().then(function(products) {

        products.forEach(function(products) {

            //console.log(products);
            return products.save(data, updateParams);

        });

    }).catch(function(err) {
        console.log(err);
        return err;
    });

}

exports.decline_product = function(id) {

    var status = 2;

    params = status;
    params = {
        "status": status
    }
    var updateParams = {
        patch: true
    }
    var data = params;
    return Booking.forge().query(function(qb) {
        qb.where('customer_id', id);
        // qb.andWhere({'status':  0});  
    }).fetchAll().then(function(products) {

        products.forEach(function(products) {

            //console.log(products);
            return products.save(data, updateParams);

        });

    }).catch(function(err) {
        console.log(err);
        return err;
    });

}

exports.getProductsbyId = function(params) {
    var fetchParams = {};
    return Booking.forge().query(function(qb) {
        qb.andWhere("id", params.couponId);
    }).fetch(fetchParams).then(function(result) {
        return result;
    }).catch(function(err) {
        return err;
    });
}

exports.add_product_in_shopping_list = function(customer_id) {
    var status = 1;

    params = status;
    params = {
        "status": status
    }
    var updateParams = {
        patch: true
    }
    var data = params;
    return Booking.forge().query(function(qb) {
        qb.where('customer_id', customer_id);
    }).fetch().then(function(result) {
        return user.save(data, updateParams);
    }).catch(function(err) {
        console.log(err);
        return err;
    });

}

/*exports.add_product_in_shopping_list =function(customer_id){

  var status = 1;

  params = status;
  params = {
  "status":status  }
  var updateParams = {
    patch : true
  }
  var data = params;
  return Products.forge().query(function(qb){
     qb.where('customer_id',customer_id);
     qb.andWhere({'status':  0});  
  }).fetchAll().then(function(user){
    return Promise.each(user.model, function(item, i){
      return user.save(data, updateParams);
    });
  }).catch(function(err){
    console.log(err);
    return err;
  });

}*/
exports.add_product_in_shopping_list = function(customer_id) {

    var status = 1;

    params = status;
    params = {
        "status": status
    }
    var updateParams = {
        patch: true
    }
    var data = params;
    return Booking.forge().query(function(qb) {
        qb.where('customer_id', customer_id);
        qb.andWhere({
            'status': 0
        });
    }).fetchAll().then(function(user) {
        return Promise.forEach(user.model, function(item, i) {
            return item.save(data, updateParams);
        });

    }).catch(function(err) {
        console.log(err);
        return err;
    });

}

exports.getAllProducts = function() {
    var fetchParams = {};
    return Booking.forge().fetchAll(fetchParams).then(function(result) {
        return result;
    }).catch(function(err) {
        return err;
    });
}