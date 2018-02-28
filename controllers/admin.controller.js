var config = require('../config'),
    Products = require('../models/admin.model'),
    ProductsServices = require('../services/admin.service'),
    helperServices = require('../services/helper.service'),
    moment = require('moment'),
    moment_tz = require('moment-timezone');
var bPromise = require('bluebird');
var DateDiff = require('date-diff');

var orm = require('../orm');

var errorTypes = require('../errortypes');

var crypto = require('crypto');
//var moment = require('moment');
//var bPromise = require('bluebird');
//var nodemailer = require('nodemailer');

var myDate = moment(new Date()).format("YYYY-MM-DD");


exports.deleteProduct = function(req, res) {
    //var productId = req.params.ProductId;
    var shop_name = (req.body.shop_name) ? req.body.shop_name : false;
    var admin_id = (req.body.admin_id) ? req.body.admin_id : false;
    var productId = (req.query.productId) ? req.query.productId : false;
    var pro = Products.forge().query(function(qb) {
        qb.select('*');
        qb.where('product_id', '=', productId);
        //qb.orWhere({userType:  userType})

    }).fetchAll().then(function(addy) {
        return addy;
    }).then(function(addy) {
        console.log("the length is " + addy.length);
        return bPromise.map(addy.models, function(addy) {

            var price_details = addy.get("price_details");
            var product_id = addy.get("product_id");
            var shop_id = addy.get("shop_name");
            //console.log("price details"+price_details);

            return ProductsServices.deleteProduct(req.body, price_details, product_id, shop_id).then(function(Products) {
                if (Products)
                    res.json({
                        "error": false,
                        "status": "success",
                        "message": "Record  deleted successfully."
                    });
                else
                    //res.json({"StatusCode":301,"Message": "An error has occurred."}); 
                    res.json({
                        "error": false,
                        "status": "success",
                        "message": "Record  deleted successfully."
                    });

            })




        })
    });
    pro.then(function(pro) {

        })
        .catch(function(err) {
            return errors.returnError(err, res);
        });

}


/*exports.editProduct = function(req, res){
  
  return orm.bookshelf.transaction(function(trx){
    return ProductsServices.editProduct(req.query.product_id,req.body).then(function(formate){
      return formate;
    }).then(function(formate){
      //console.log("delete");
      //console.log(formate);
    }).catch(function(err) {
      return errors.returnError(err,res);
    });
  }).then(function(invi){
    //res.json({"success":true,"message":"invoice formate created successfully.","data":invi});
    res.json({"error":false,"status":"success","message":"Record  update successfully.","result":invi});
  }).catch(function(err) {
    return errors.returnError(err,res);
  });

}*/

exports.editProduct = function(req, res) {

    var product_name = (req.body.product_name) ? req.body.product_name : false;

    /*var product_name = (req.body.product_name)?req.body.product_name:false;
    var product_price = (req.body.product_price)?req.body.product_price:false;
    var shop_name = (req.body.shop_name)?req.body.shop_name:false;
    var task_type = (req.body.task_type)?req.body.task_type:false;
    var admin_id = (req.body.admin_id)?req.body.admin_id:false;
*/
    var pro = Products.forge().query(function(qb) {
        qb.select('*');
        qb.where('product_name', '=', product_name);
        //qb.orWhere({userType:  userType})

    }).fetchAll().then(function(addy) {
        return addy;
    }).then(function(addy) {
        console.log("the length is " + addy.length);
        return bPromise.map(addy.models, function(addy) {

            var price_details = addy.get("price_details");
            var product_id = addy.get("product_id");
            //console.log("price details"+price_details);

            return ProductsServices.editProduct(req.body, price_details, product_id).then(function(Products) {
                if (Products)
                    res.json({
                        "error": false,
                        "status": "success",
                        "message": "Record  update successfully.",
                        "result": invi
                    });
                else
                    res.json({
                        "StatusCode": 301,
                        "Message": "An error has occurred."
                    });
            })




        })
    });
    pro.then(function(pro) {

        })
        .catch(function(err) {
            return errors.returnError(err, res);
        });

}


exports.add = function(req, res) {

    var product_name = (req.body.product_name) ? req.body.product_name : false;
    var product_price = (req.body.product_price) ? req.body.product_price : false;
    var shop_name = (req.body.shop_name) ? req.body.shop_name : false;
    var task_type = (req.body.task_type) ? req.body.task_type : false;
    var admin_id = (req.body.admin_id) ? req.body.admin_id : false;

    var pro = Products.forge().query(function(qb) {
        qb.select('*');
        qb.where('product_name', '=', product_name);
        //qb.orWhere({userType:  userType})

    }).fetchAll().then(function(addy) {
        return addy;
    }).then(function(addy) {
        console.log("the length is " + addy.length);
        return bPromise.map(addy.models, function(addy) {

            var price_details = addy.get("price_details");
            var product_id = addy.get("product_id");
            var shop_id = addy.get("shop_name");
            //console.log("price details"+price_details);


            if (addy.length == 0) {

                return ProductsServices.add(req.body).then(function(Products) {
                    if (Products)
                        res.json({
                            "StatusCode": 200,
                            "Products_": Products,
                            "ResponseMessage": "successfully added !!"
                        });
                    else
                        res.json({
                            "StatusCode": 301,
                            "Message": "An error has occurred."
                        });
                })

            } else {

                return ProductsServices.add1(req.body, price_details, product_id, shop_id).then(function(Products) {
                    if (Products)
                        res.json({
                            "StatusCode": 200,
                            "Products_": Products,
                            "ResponseMessage": "successfully added !!"
                        });
                    else
                        res.json({
                            "StatusCode": 301,
                            "Message": "An error has occurred."
                        });
                })

            }


            /*return {

        price_details: addy.get("price_details"),
        product_name: addy.get("product_name"),
        admin_id: addy.get("admin_id"),
        product_quantity: addy.get("product_quantity"),
        shop_name: addy.get("shop_name"),
        product_price: addy.get("product_price"),
            
      }*/



        })
    });
    pro.then(function(pro) {
            if (pro.length == 0) {
                return ProductsServices.add(req.body).then(function(Products) {
                    if (Products)
                        res.json({
                            "StatusCode": 200,
                            "Products_": Products,
                            "ResponseMessage": "successfully added !!"
                        });
                    else
                        res.json({
                            "StatusCode": 301,
                            "Message": "An error has occurred."
                        });
                })
                /*return ProductsServices.add(req.body).then(function(Products){
                    if(Products)
                       res.json({"StatusCode": 200,"Products_": Products,"ResponseMessage": "successfully added !!"});
                    else
                        res.json({"StatusCode":301,"Message": "An error has occurred."}); 
                  })*/
                /*return ProductsServices.add(req.body).then(function(Products){
            if(Products)
               res.json({"StatusCode": 200,"Products_": Products,"ResponseMessage": "successfully added !!"});
            else
                res.json({"StatusCode":301,"Message": "An error has occurred."}); 
        })
            var pro = [];
            res.json({"error":false, status:"success","message":"User mobile no is not registered", result:pro});*/
            } else {

                /*return ProductsServices.add1(req.body).then(function(Products){
                  if(Products)
                     res.json({"StatusCode": 200,"Products_": Products,"ResponseMessage": "successfully added !!"});
                  else
                      res.json({"StatusCode":301,"Message": "An error has occurred."}); 
                })*/

            }
        })
        .catch(function(err) {
            return errors.returnError(err, res);
        });
};


/*return ProductsServices.add(req.body).then(function(Products){
    if(Products){
      res.json({"StatusCode": 200,"Products_": Products,"ResponseMessage": "successfully added !!"});
      }else{
      res.json({"StatusCode":301,"Message": "An error has occurred."});
          }
      }).catch(function(err){
      res.json({"StatusCode":err.status,"Products_":[],"ResponseMessage":err.messages});
      });
}*/

exports.getadmin_add_product = function(req, res) {

    var user_id = (req.query.user_id) ? req.query.user_id : false;
    var user = Products.forge().query(function(qb) {
        qb.select('admin_id', 'product_id', 'product_name', 'product_quantity', 'product_price', 'shop_name');

        qb.where('shop_name', 'like', '%' + user_id + '%');

    }).fetchAll().then(function(addy) {
        return addy;
    }).then(function(addy) {

        return bPromise.map(addy.models, function(addy) {

            return {

                product_id: addy.get("product_id"),
                product_name: addy.get("product_name"),
                admin_id: addy.get("admin_id"),
                product_quantity: addy.get("product_quantity"),
                shop_name: addy.get("shop_name"),
                product_price: addy.get("product_price"),

            }

        })
    });

    user.then(function(user) {
            if (user.length == 0) {

                var user = [];
                res.json({
                    "error": false,
                    status: "success",
                    "message": "Something going wrong",
                    result: user
                });
            } else {

                res.json({
                    "error": false,
                    status: "success",
                    "message": "List of products add by admn",
                    result: user
                });
            }
        })
        .catch(function(err) {
            return errors.returnError(err, res);
        });
};