var config = require('../config'),
    Products = require('../models/Products.model'),
    Recipes = require('../models/Recipes.model'),
    user = require('../models/Users.model'),
    Products_list = require('../models/Products_list.model'),
    Customer = require('../models/Customer.model'),
    ProductsServices = require('../services/Products.service'),
    helperServices = require('../services/helper.service'),
    moment = require('moment'),
    Area = require('../models/AreaOfService.model'),
    moment_tz = require('moment-timezone');
var bPromise = require('bluebird');
var DateDiff = require('date-diff');
var crypto = require('crypto');

var orm = require('../orm');


var errorTypes = require('../errortypes');


exports.calender = function(req, res) {

    var task_type = (req.query.task_type) ? req.query.task_type : false;
    var customer_id = (req.query.customer_id) ? req.query.customer_id : false;
    var park = Recipes.forge().query(function(qb) {
        qb.select('*');
        qb.where('status', '=', 'reminder');
        qb.andWhere('task_type', task_type);
        qb.andWhere({
            'customer_id': customer_id
        })
        qb.groupBy("date");

        //qb.andWhere({'customer_id',customer_id })
        //qb.where('recipe_id', '=', 673);
        //qb.limit(6);673
        //qb.where('tbl_recipe.parking_id', '=', 1);
    }).fetchAll().then(function(addy) {
        return addy;
    }).then(function(addy) {

        return bPromise.map(addy.models, function(addy) {

            return {

                date: addy.get("date"),
            }

        })
    });
    park.then(function(park) {
            if (park.length == 0) {

                var park = [];
                res.json({
                    "error": false,
                    "StatusCode": 200,
                    status: "success",
                    "message": "No records are found"
                });
            } else {
                if (task_type == 'Food') {
                    res.json({
                        "error": false,
                        "StatusCode": 200,
                        status: "success",
                        task_type: 1,
                        "message": "These are the records",
                        result: park
                    });

                }
                if (task_type == 'Cleaning') {
                    res.json({
                        "error": false,
                        "StatusCode": 200,
                        status: "success",
                        task_type: 2,
                        "message": "These are the records",
                        result: park
                    });
                }
                if (task_type == 'Sports') {
                    res.json({
                        "error": false,
                        "StatusCode": 200,
                        status: "success",
                        task_type: 3,
                        "message": "These are the records",
                        result: park
                    });
                }
                if (task_type == 'Events') {
                    res.json({
                        "error": false,
                        "StatusCode": 200,
                        status: "success",
                        task_type: 4,
                        "message": "These are the records",
                        result: park
                    });
                }
                if (task_type == 'Body') {
                    res.json({
                        "error": false,
                        "StatusCode": 200,
                        status: "success",
                        task_type: 5,
                        "message": "These are the records",
                        result: park
                    });
                }

                //res.json({"error":false, status:"success","message":"These are the records", result:park});

            }
        })
        .catch(function(err) {
            return errors.returnError(err, res);
        });
};

exports.calender_detail = function(req, res) {

    var date = (req.body.date) ? req.body.date : false;
    console.log("Now date is" + date);
    var task_type = (req.body.task_type) ? req.body.task_type : false;
    //var final_date=moment(date).format('YYYY-MM-DDh:mm:ss a'); 
    //var final_date=moment(date).format('YYYY-MM-DDh:mm:ss'); 
    console.log("==============================");
    //console.log(final_date);
    console.log("==============================");
    console.log("date is " + date);
    var park = Recipes.forge().query(function(qb) {
        qb.select('*');
        //qb.whereBetween('recipe_id', [675,690]);
        //qb.whereBetween('recipe_id', [675,690]);
        //qb.andWhere('date', 'like', '%'+date+'%')
        qb.where('recipe_code', '!=', date)
        qb.andWhere('date_format', 'like', '%' + date + '%')
        qb.andWhere('task_type', task_type);
        //qb.Where('date', 'like', '%'+date+'%')
        //qb.andWhere('date', 'like', '%2017-05-1812:00:00%')
        //qb.andWhere('task_type', task_type);
    }).fetchAll().then(function(addy) {
        return addy;
    }).then(function(addy) {

        return bPromise.map(addy.models, function(addy) {

            /*var recipe_id =addy.get("recipe_code");
            var product_title =addy.get("product_title");
            var product_description =addy.get("product_description");
            var pro_details =addy.get("pro_details");
            var date =addy.get("date");
            var time =addy.get("time");
            var start_time =addy.get("start_time");
            var end_time =addy.get("end_time");
            var budget =addy.get("budget");
            var type =addy.get("type");
            var productData2=pro_details;*/

            if (task_type == 'Food' || task_type == 'Sports' || task_type == 'Body') {


                return {
                    recipe_code: addy.get("recipe_code"),
                    product_title: addy.get("product_title"),
                    product_description: addy.get("product_description"),

                }

            }
            if (task_type == 'Events' || task_type == 'Event') {

                return {
                    recipe_code: addy.get("recipe_code"),
                    product_title: addy.get("product_title"),
                    product_description: addy.get("product_description"),
                    start_time: addy.get("start_time"),
                    end_time: addy.get("end_time"),
                    budget: addy.get("budget"),

                }

            }

            if (task_type == 'Cleaning') {

                return {
                    recipe_code: addy.get("recipe_code"),
                    product_title: addy.get("product_title"),
                    product_description: addy.get("product_description"),
                    type: addy.get("type"),
                    time: addy.get("time"),

                }

            }

        })
    });
    park.then(function(park) {
            if (park.length == 0) {

                var park = [];
                res.json({
                    "error": false,
                    "StatusCode": 200,
                    status: "success",
                    "message": "No records are found"
                });
            } else {

                if (task_type == 'Food') {
                    res.json({
                        "error": false,
                        "StatusCode": 200,
                        status: "success",
                        task_type: 1,
                        "message": "These are the records",
                        result: park
                    });
                }
                if (task_type == 'Cleaning') {
                    res.json({
                        "error": false,
                        "StatusCode": 200,
                        status: "success",
                        task_type: 2,
                        "message": "These are the records",
                        result: park
                    });
                }
                if (task_type == 'Sports') {
                    res.json({
                        "error": false,
                        "StatusCode": 200,
                        status: "success",
                        task_type: 3,
                        "message": "These are the records",
                        result: park
                    });
                }
                if (task_type == 'Events') {
                    res.json({
                        "error": false,
                        "StatusCode": 200,
                        status: "success",
                        task_type: 4,
                        "message": "These are the records",
                        result: park
                    });
                }
                if (task_type == 'Body') {
                    res.json({
                        "error": false,
                        "StatusCode": 200,
                        status: "success",
                        task_type: 5,
                        "message": "These are the records",
                        result: park
                    });
                }
            }
        })
        .catch(function(err) {
            return errors.returnError(err, res);
        });
};


exports.calender_ingredients_detail = function(req, res) {

    var recipe_id = (req.query.recipe_id) ? req.query.recipe_id : false;

    console.log("recipe_id" + recipe_id);

    var ingredients = Products.forge().query(function(qb) {
        qb.select('*');
        qb.where('recipe_code', '=', recipe_id)
    }).fetchAll().then(function(addy) {
        return addy;
    }).then(function(addy) {

        return bPromise.map(addy.models, function(addy) {

            return {

                customer_id: addy.get("customer_id"),
                product_id: addy.get("product_id"),
                product_name: addy.get("product_name"),
                product_weight: addy.get("product_weight"),
                product_quantity: addy.get("product_quantity"),

            }

        })
    });
    ingredients.then(function(ingredients) {
            if (ingredients.length == 0) {

                var ingredients = [];
                res.json({
                    "error": false,
                    status: "success",
                    "message": "No records are found"
                });
            } else {
                //return res.json({"shopDetail":ingredients});
                res.json({
                    "error": false,
                    "StatusCode": 200,
                    status: "success",
                    "message": "These are the records",
                    ingredients
                });

            }
        })
        .catch(function(err) {
            return errors.returnError(err, res);
        });
};