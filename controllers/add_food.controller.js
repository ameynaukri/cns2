var config = require('../config'),
    Products = require('../models/Products.model'),
    Recipes = require('../models/Recipes.model'),
    user = require('../models/user.model'),
    Products_list = require('../models/Products_list.model'),
    Customer = require('../models/Customer.model'),
    chk = require('../models/ShowCheckout.model'),
    ProductsServices = require('../services/Products.service'),
    helperServices = require('../services/helper.service'),
    moment = require('moment'),
    moment_tz = require('moment-timezone');
var bPromise = require('bluebird');
var DateDiff = require('date-diff');
var crypto = require('crypto');

var orm = require('../orm');


//var BCrypt = require('bcrypt-nodejs');
//var helper = require('./controller.helper');
var errorTypes = require('../errortypes');
//var errors = require('./errors.controller.helper');
var crypto = require('crypto');
//var moment = require('moment');
//var bPromise = require('bluebird');
//var nodemailer = require('nodemailer');

function randomValueHex(len) {
    return crypto.randomBytes(Math.ceil(len / 2))
        .toString('hex') // convert to hexadecimal format
        .slice(0, len); // return required number of characters
}

/*console.log("hello");
var RecipesData = new Recipes({
			"product_title":product_title,
			"product_description":product_description,
			"date":date_format,
			"date_format":date,
			"task_type":task_type,
			"type":type,
			"customer_id":customer_id,
			"recipe_code":code,
			"status":status    
		});

			RecipesData.save(null).tap(function (model){
				RecipesData = model;
			}).then(function(RecipesData){
				var p_data = JSON.parse(pro2);
			}).catch(function(err){
				return err;
			});	*/

/*exports.add_food = function(req, res){
	var pro=req.body;
	var pro2 = pro.productData2;
	var p_data = JSON.stringify(pro2);

	var RecipesData = new Recipes({

                "customer_id":customer_id,
                "product_description":p_data,
                    //"vehicle_type":vehicle_type,
                    //vehicle_number":vehicle_number,
                    
            });
    RecipesData.save(null).tap(function (model){
        Vehicle2Data = model;
        console.log("The product data is "+RecipesData);

    }).then(function(Vehicle2Data){
        res.json({"StatusCode": 200,"Products_": Recipes,"ResponseMessage": "successfully added !!"});
    }).catch(function(err){

    }); 

}*/

exports.add_food = function(req, res) {
    console.log("==========Food=============");

    var code = randomValueHex(7)
    var f_data = [];

    var technology = (req.body.technology) ? req.body.technology : false;

    if (technology == 'ios') {

        if (Object.prototype.toString.call(req.body.productData2[0].product_weight) === '[object Array]') {


            console.log("if wala part");
            var product_title = (req.body.product_title) ? req.body.product_title : false;
            var product_description = (req.body.product_description) ? req.body.product_description : false;
            var date = (req.body.date) ? req.body.date : false;
            var task_type = (req.body.task_type) ? req.body.task_type : false;
            var type = (req.body.type) ? req.body.type : false;
            var customer_id = (req.body.customer_id) ? req.body.customer_id : false;

            var status = (req.body.status) ? req.body.status : false;
            var date = (req.body.date) ? req.body.date : false;
            var date_format = moment(date).format('YYYY-MM-DD');

            var RecipesData = new Recipes({
                "product_title": product_title,
                "product_description": product_description,
                "date": date_format,
                "date_format": date,
                "task_type": task_type,
                "type": type,
                "customer_id": customer_id,
                "recipe_code": code,
                "status": status
            });

            RecipesData.save(null).tap(function(model) {
                RecipesData = model;
            }).then(function(RecipesData) {
                var p_data = JSON.parse(pro2);
            }).catch(function(err) {
                return err;
            });

            for (var k = 0; k < req.body.productData2[0].product_weight.length; k++) {
                d = {
                    "product_weight": req.body.productData2[0].product_weight[k],
                    "product_name": req.body.productData2[0].product_name[k],
                    "product_id": req.body.productData2[0].product_id[k],
                    "product_quantity": req.body.productData2[0].product_quantity[k],
                    "customer_id": req.body.productData2[0].customer_id[k]
                }
                console.log("the value of d is " + d);
                f_data.push(d);
            }
            req.body.productData2 = f_data;
            console.log("The value of prodata 2 is " + req.body.productData2);
            var pro = req.body.productData2;
            var p_data = pro;
            console.log("============================");
            console.log("The pro is " + p_data);
            console.log("============================");




            for (var i = 0; i < p_data.length; i++) {
                console.log(i);
                var product_name = p_data[i].product_name;
                var product_weight = p_data[i].product_weight;
                var product_quantity = p_data[i].product_quantity;
                var product_id = p_data[i].product_id;
                var customer_id = p_data[i].customer_id;
                console.log("=======Panditji==============");
                console.log("product_weight is =" + product_weight);
                console.log("product_name is =" + product_name);
                console.log("product id is =" + product_id);
                console.log("=======Panditji==============");
                var ProductsData = new Products({
                    "product_name": product_name,
                    "product_weight": product_weight,
                    "product_quantity": product_quantity,
                    "customer_id": customer_id,
                    "product_id": product_id,
                    "task_type": task_type,
                    "recipe_code": code,
                });
                ProductsData.save(null).tap(function(model) {
                    ProductsData = model;
                    //	console.log("The product data is "+ProductsData);

                }).then(function(ProductsData) {
                    //res.json({"StatusCode": 200,"Products_": Products,"ResponseMessage": "successfully added !!"});
                }).catch(function(err) {

                });
            }
            console.log("==========Panditji code end=============");

        } else if (req.body.productData2[0].product_weight != '') {
            console.log("else wala part");

            /*console.log("All data is "+req.body.productData2[0].product_name);
            var pro=req.body;
            var pro2 = pro.productData2;
            var p_data = JSON.parse(pro2);*/

            /*console.log("The pro 2 lenght is "+p_data);
            console.log("hello panditji");
		
            console.log("The loop pandit ji is working ");
            console.log("the loop is "+req.body.productData2[0].product_weight);*/
            var product_title = (req.body.product_title) ? req.body.product_title : false;
            var product_description = (req.body.product_description) ? req.body.product_description : false;
            var date = (req.body.date) ? req.body.date : false;
            var task_type = (req.body.task_type) ? req.body.task_type : false;
            var type = (req.body.type) ? req.body.type : false;
            var customer_id = (req.body.customer_id) ? req.body.customer_id : false;

            var status = (req.body.status) ? req.body.status : false;
            var date = (req.body.date) ? req.body.date : false;
            var date_format = moment(date).format('YYYY-MM-DD');

            var RecipesData = new Recipes({
                "product_title": product_title,
                "product_description": product_description,
                "date": date_format,
                "date_format": date,
                "task_type": task_type,
                "type": type,
                "customer_id": customer_id,
                "recipe_code": code,
                "status": status
            });

            RecipesData.save(null).tap(function(model) {
                RecipesData = model;
            }).then(function(RecipesData) {
                var p_data = JSON.parse(pro2);
            }).catch(function(err) {
                return err;
            });
            var product_name = req.body.productData2[0].product_name;
            var product_weight = req.body.productData2[0].product_weight;
            var product_quantity = req.body.productData2[0].product_quantity;
            var product_id = req.body.productData2[0].product_id;
            var customer_id = req.body.productData2[0].customer_id;

            console.log("Product name " + product_name);
            console.log("product name with K is " + req.body.productData2[0].product_weight[0])

            var ProductsData = new Products({
                "product_name": product_name,
                "product_weight": product_weight,
                "product_quantity": product_quantity,
                "customer_id": customer_id,
                "product_id": product_id,
                "task_type": task_type,
                "recipe_code": code,
            });
            ProductsData.save(null).tap(function(model) {
                ProductsData = model;
                //	console.log("The product data is "+ProductsData);

            }).then(function(ProductsData) {
                //res.json({"StatusCode": 200,"Products_": Products,"ResponseMessage": "successfully added !!"});
            }).catch(function(err) {

            });


        }

    }
    /*var pro=req.body;
    var pro2 = pro.productData2;
    var p_data = JSON.parse(pro2);

    console.log("The pro 2 lenght is "+p_data.length);*/



    /*console.log("hello panditji");
    console.log("=======Panditji code start===========");*/
    else {


        console.log("=======Android++=========");
        var pro = req.body;
        var pro2 = pro.productData2;
        console.log("==================add-food=========================");
        console.log(pro2);
        console.log("==================add-food=========================");
        var code = randomValueHex(7)

        console.log("The pro 2 is =" + pro.productData2);
        console.log("And now pro 2 will be =" + pro2);

        var product_title = (req.body.product_title) ? req.body.product_title : false;
        var product_description = (req.body.product_description) ? req.body.product_description : false;
        var date = (req.body.date) ? req.body.date : false;
        var task_type = (req.body.task_type) ? req.body.task_type : false;
        var type = (req.body.type) ? req.body.type : false;
        var customer_id = (req.body.customer_id) ? req.body.customer_id : false;

        var status = (req.body.status) ? req.body.status : false;
        var date = (req.body.date) ? req.body.date : false;
        var date_format = moment(date).format('YYYY-MM-DD');

        var RecipesData = new Recipes({
            "product_title": product_title,
            "product_description": product_description,
            "date": date_format,
            "date_format": date,
            "task_type": task_type,
            "type": type,
            "customer_id": customer_id,
            "recipe_code": code,
            "status": status
        });

        RecipesData.save(null).tap(function(model) {
            RecipesData = model;
        }).then(function(RecipesData) {

        }).catch(function(err) {
            console.log("error 2");
            return err;
        });

        var p_data = JSON.parse(pro2);
        //var p_data = pro2;
        bPromise.each(p_data, function(elements) {
            console.log("Promise loop ");
            console.log("The elements are " + elements);
            //return element+'.';

        }).then(function(pro2) {
            console.dir(pro2);

            for (var i = 0; i < pro2.length; i++) {
                var product_name = p_data[i].product_name;
                var product_weight = p_data[i].product_weight;
                var product_unit = p_data[i].product_unit;
                var product_id = p_data[i].product_id;
                var customer_id = p_data[i].customer_id;
                console.log("=======Arun==============");
                //console.log("product_weight is ="+product_weight);
                console.log("product_name is =" + product_name);
                console.log("product id is =" + product_id);
                console.log("=======Arun==============");
                var ProductsData = new Products({
                    "product_name": product_name,
                    "product_weight": product_weight,
                    "product_quantity": product_unit,
                    "customer_id": customer_id,
                    "task_type": task_type,
                    "product_id": product_id,
                    "recipe_code": code,
                });
                ProductsData.save(null).tap(function(model) {
                    ProductsData = model;
                    console.log("The product data is " + ProductsData);

                }).then(function(ProductsData) {
                    //res.json({"StatusCode": 200,"Products_": Products,"ResponseMessage": "successfully added !!"});
                }).catch(function(err) {

                });

            }
        });

    }
    finalResult(req, res, customer_id, code);
    console.log("==========Arun code end=============");
};


function finalResult(req, res, customer_id, code) {

    console.log("customer id is=" + customer_id);
    var ChkData = new chk({
        "code": code,
        "customer_id": customer_id
    });

    ChkData.save(null).tap(function(model) {
        ChkData = model;
    }).then(function(ChkData) {
        //res.json({"StatusCode": 200,"ResponseMessage": "successfully added !!"});
        res.json({
            "StatusCode": 200,
            "ResponseMessage": "successfully added !!"
        });

    }).catch(function(err) {
        console.log("error 2");

        return err;
    });
}