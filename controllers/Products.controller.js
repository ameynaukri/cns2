var config = require('../config'),
    Products = require('../models/Products.model'),
    Booking = require('../models/Booking.model'),
    Recipes = require('../models/Recipes.model'),
    adminProducts = require('../models/admin2.model'),
    chk = require('../models/ShowCheckout.model'),
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

//var moment = require('moment');
//var bPromise = require('bluebird');
//var nodemailer = require('nodemailer');
console.log("hello");
exports.accept_product = function(req, res) {

    console.log("accept_product");
    console.log(req.body);
    console.log("The Password is " + req.query.id);
    console.log(req.query.id);
    return ProductsServices.accept_product(req.query.id).then(function(result) {

        if (result)

            res.json({
                "StatusCode": 200,
                "result": result,
                "ResponseMessage ": "Record is accept succesfully"
            });

        else
            //res.json({"StatusCode":301,"result": result,"ResponseMessage": "Something went wrong"});
            res.json({
                "StatusCode": 200,
                "result": result,
                "ResponseMessage ": "Record is accept succesfully"
            });

    }).catch(function(err) {
        console.log(err);
        res.json({
            "StatusCode": err.status,
            "result": [],
            "ResponseMessage": err.messages
        });
    });


}


exports.decline_product = function(req, res) {
    console.log("decline_product");
    console.log(req.body);
    console.log("The Password is " + req.query.id);

    console.log(req.query.id);
    return ProductsServices.decline_product(req.query.id).then(function(result) {

        if (result)

            res.json({
                "StatusCode": 200,
                "ResponseMessage ": "Record is decline succesfully"
            });

        else
            //res.json({"StatusCode":301,"result": result,"ResponseMessage": "Something went wrong"});
            res.json({
                "StatusCode": 200,
                "ResponseMessage ": "Record is decline succesfully"
            });

    }).catch(function(err) {
        console.log(err);
        res.json({
            "StatusCode": err.status,
            "result": [],
            "ResponseMessage": err.messages
        });
    });


}

exports.get_list_customer_accept_offer = function(req, res) {
    var myDate = moment(new Date()).format("YYYY-MM-DD");
    var id = (req.query.id) ? req.query.id : false;
    console.log("loop id is  " + id)
    //var area = user.forge().query(function (qb) {
    var area = Booking.forge().query(function(qb) {
        qb.select('user.first_name',
            'user.address', 'user.date',
            'tbl_booking.product_name',
            'tbl_booking.customer_id',
            'tbl_booking.product_id'
        );
        qb.countDistinct('tbl_booking.product_name as  productcount');
        qb.innerJoin('user', function() {
            qb.where('tbl_booking.status', '=', 1)

        })
        qb.groupBy("tbl_booking.customer_id");
    }).fetchAll().then(function(addy) {
    }).then(function(addy) {
        return bPromise.map(addy.models, function(addy) {
            var dateC = moment(addy.get("date"));
            var dateB = moment(myDate);
            console.log(dateC);
            console.log(dateB);
            return {
                productcount: addy.get("productcount"),
                customer_id: addy.get("customer_id"),
                product_id: addy.get("product_id"),
                first_name: addy.get("first_name"),
                address: addy.get("address"),
                months: dateB.diff(dateC, 'months')
            }
        })
    });

    area.then(function(area) {
            if (area.length == 0) {
                var area = [];
                res.json({
                    "error": false,
                    "StatusCode": 201,
                    status: "success but records are not present",
                    "message": "",
                    result: area
                });
            } else {
                res.json({
                    "error": false,
                    "StatusCode": 200,
                    status: "success",
                    "message": "",
                    result: area
                });
            }
        })
        .catch(function(err) {
            return errors.returnError(err, res);
        });
};


exports.get_customer_detail = function(req, res) {
    var myDate = moment(new Date()).format("YYYY-MM-DD");
    var id = (req.query.id) ? req.query.id : false;
    console.log("loop id is  " + id)
    var area = user.forge().query(function(qb) {
        qb.distinct('tbl_booking.product_name');
        qb.select('tbl_booking.product_name',
            'tbl_booking.customer_id',
            'tbl_booking.product_id', 'user.first_name', 'user.address', 'user.date');
        //qb.distinct('tbl_product_details.product_name');
        //count(distinct `active`) 
        qb.countDistinct('tbl_booking.product_name as  productcount');
        qb.innerJoin('tbl_booking', function() {

            //qb.where('tbl_customer_login.product_name', '=', 'POha');
            //qb.where('Customer.customer_id', '=', id);
            //qb.where('tbl_customer_login.customer_id', '=', 1);
            this.on('tbl_booking.customer_id', '=', 'user.id')
            //qb.where('tbl_product_details.customer_id', '=', id)
            //qb.andWhere({contact_no:  contact_no})
            qb.where('tbl_booking.status', '=', 0)
            qb.andWhere({
                'tbl_booking.admin_id': id
            })
            //qb.andWhere({'tbl_product_details.status':  0})
            //qb.where('user.status', '=', 0);
        })
        qb.groupBy("tbl_booking.customer_id");
        /*qb.select('tbl_product_details.product_name','user.address','user.date');
        qb.count('tbl_product_details.product_name as  productcount');
		qb.innerJoin('tbl_product_details', function() {
			
			
			this.on('tbl_product_details.customer_id', '=', 'user.id')
			qb.where('tbl_product_details.admin_id', '=', id)
			
			qb.andWhere({'user.status':  0})
		})*/


        //qb.where('Customer.customer_id', '=', id);
        //qb.groupBy("customer_name");
        //qb.groupBy("user.username");
    }).fetchAll().then(function(addy) {

        return addy;

    }).then(function(addy) {
        return bPromise.map(addy.models, function(addy) {
            // console.log(addy);
            var dateC = moment(addy.get("date"));
            var dateB = moment(myDate);
            console.log(dateC);
            console.log(dateB);
            return {
                productcount: addy.get("productcount"),

                customer_id: addy.get("customer_id"),

                product_id: addy.get("product_id"),
                first_name: addy.get("first_name"),
                address: addy.get("address"),
                months: dateB.diff(dateC, 'months')

                //product_price: addy.get("product_price")
                //customer_id: addy.get("customer_id")

                /*customer_name: addy.get("customer_name"),
                product_name: addy.get("product_name"),
                */

            }
        })
    });

    area.then(function(area) {
            if (area.length == 0) {
                var area = [];
                res.json({
                    "error": false,
                    "StatusCode": 201,
                    status: "success but records are not present",
                    "message": "",
                    result: area
                });
            } else {
                res.json({
                    "error": false,
                    "StatusCode": 200,
                    status: "success",
                    "message": "",
                    result: area
                });
            }
        })
        .catch(function(err) {
            return errors.returnError(err, res);
        });
};
exports.get_customer_accept_detail = function(req, res) {
    console.log("Get customer accept details call 3018 port");
    var myDate = moment(new Date()).format("YYYY-MM-DD");
    var id = (req.query.id) ? req.query.id : false;
    console.log("loop id is  " + id);
    var area = user.forge().query(function(qb) {
        qb.select('tbl_booking.product_name', 'tbl_booking.customer_id', 'tbl_booking.product_id', 'user.first_name', 'user.address', 'user.date');
        qb.countDistinct('tbl_booking.product_name as  productcount');
        //qb.group_concat('tbl_product_details.product_name as productname')
        qb.innerJoin('tbl_booking', function() {

            //qb.where('tbl_customer_login.product_name', '=', 'POha');
            //qb.where('Customer.customer_id', '=', id);
            //qb.where('tbl_customer_login.customer_id', '=', 1);
            this.on('tbl_booking.customer_id', '=', 'user.id')
            qb.where('tbl_booking.status', '=', 0)
            qb.andWhere({
                'tbl_booking.admin_id': id
            })
            //qb.where('tbl_product_details.customer_id', '=', id)
            //qb.where('tbl_product_details.customer_id', '=', id)
            //qb.andWhere({contact_no:  contact_no})
            //qb.andWhere({'tbl_product_details.status':  1})
            //qb.where('user.status', '=', 0);
        })


        //qb.where('Customer.customer_id', '=', id);
        //qb.groupBy("customer_name");
        qb.groupBy("tbl_booking.customer_id");
    }).fetchAll().then(function(addy) {

        return addy;

    }).then(function(addy) {
        return bPromise.map(addy.models, function(addy) {
            // console.log(addy);
            var dateC = moment(addy.get("date"));
            var dateB = moment(myDate);
            console.log(dateC);
            console.log(dateB);
            return {
                productcount: addy.get("productcount"),
                customer_id: addy.get("customer_id"),
                product_id: addy.get("product_id"),
                first_name: addy.get("first_name"),
                address: addy.get("address"),
                months: dateB.diff(dateC, 'months')
                //product_price: addy.get("product_price")
                //customer_id: addy.get("customer_id")

                /*customer_name: addy.get("customer_name"),
                product_name: addy.get("product_name"),
                */

            }
        })
    });

    area.then(function(area) {
            if (area.length == 0) {
                var area = [];
                res.json({
                    "error": false,
                    "StatusCode": 201,
                    status: "success but records are not present",
                    "message": "",
                    result: area
                });
            } else {
                res.json({
                    "error": false,
                    "StatusCode": 200,
                    status: "success",
                    "message": "",
                    result: area
                });
            }
        })
        .catch(function(err) {
            return errors.returnError(err, res);
        });
};

/*exports.get_product_by_lat_lng = function(req, res){

	var shop=[];
	var newArray = [];
	var productsList = [];
	var startPoint = {
		latitude:req.body.lat,
		longitude:req.body.lng
	};
	var body = req.body;

	var areaDist = (req.body.areaDist)?req.body.areaDist:false;
	var area = Area.forge().query(function (qb) {
		qb.select('*');
	}).fetchAll().then(function(addy) {
		return addy;

	}).then(function(addy){
		if(addy.length){

			return bPromise.map(addy.models, function(addy){
				var latitude = addy.get("latitude");
				var longitude = addy.get("longitude");
				var shop_name = addy.get("shop_name");


				var endPoint = 
				{
					latitude:latitude,
					longitude:longitude
				};
				var distance = ProductsServices.getDistance(startPoint,endPoint,2);
				if(distance <= areaDist){
					if(shop.indexOf(shop_name) == -1){
						shop.push(shop_name);
					}
					addy.attributes.status = 200;
					newArray.push(addy);
				}
				return newArray;

			})
		}else{
			return addy;
		}
	}).then(function(newArray){
		return Products_list.forge().query(function(qb){
			//qb.whereIn("product_name", body.product_name);
			qb.whereIn("product_name", 'Poha');
		}).fetchAll().then(function(data){
			return bPromise.map(data.models, function(productData){
				//productsList = productData;
				var price_details = JSON.parse(productData.get("price_details"));
				for(var i=0; i<price_details.length; i++){
					var getPro = price_details[i];
					if(shop.indexOf(getPro.shop_name) > -1){
						productsList.push(getPro);
					}
				}
				return productsList;
			});
		});
	}).then(function(data){
		return Products.forge().query(function(qb){
			qb.whereIn("product_name", 'Poha');
			qb.andWhere({"customer_id" : 77});

			//qb.whereIn("product_name", body.product_name);
			//qb.andWhere({"customer_id" : body.customer_id});
			qb.andWhere({"status" : 2});
		}).fetchAll().then(function(detailsData){
			return detailsData.models[0].get('product_weight');
		});
	}).then(function(productWdt){
		for(var i=0; i<productsList.length; i++){
			var getPro = productsList[i];
			getPro.final_price = (getPro.price*productWdt);
			getPro.product_quantity = productWdt;
		}
		return productsList;
	}).then(function(result){

		if(newArray.length)
			res.json({"error":false,"status" : "success", "message" :"","result":result,"AllShopes":shop});
		else
			res.json({"error":true,"status" : "error", "message" :"No records founds.","result":newArray});

	}).catch(function(err) {
		res.json({"error":true,"status" : "error", "message" : err.message,"result":err.message});
	});

};*/
exports.get_product_by_lat_lng = function(req, res) {


    var shop = [];
    var newArray = [];
    var productsList = [];
    var startPoint = {
        latitude: req.body.lat,
        longitude: req.body.lng
    };
    //var body = req.body;
    console.log("get_product_by_lat_lng");

    var areaDist = (req.body.areaDist) ? req.body.areaDist : false;
    var task_type = (req.body.task_type) ? req.body.task_type : false;

    console.log("task_type =" + task_type);

    /*if(task_type='false')
    {

    	console.log("Hello");

    }*/

    //if bracket start	
    var area = adminProducts.forge().query(function(qb) {
        //
        if (task_type == 'Body' || task_type == 'Events' || task_type == 'Cleaning' || task_type == 'Sports' || task_type == 'Food') {
            qb.select('tbl_area_of_services.longitude',
                'tbl_area_of_services.latitude',
                'tbl_list_of_all_products.product_id',
                'tbl_list_of_all_products.product_name',
                'tbl_list_of_all_products.unit'
            );
            qb.innerJoin('tbl_area_of_services', function() {
                this.on('tbl_area_of_services.id', '=', 'tbl_admin_product_name.shop_id')
            })

            qb.innerJoin('tbl_list_of_all_products', function() {
                this.on('tbl_list_of_all_products.product_id', '=', 'tbl_admin_product_name.product_id')
            })
            qb.where('tbl_list_of_all_products.task_type', '=', task_type);
            qb.groupBy('tbl_list_of_all_products.product_name');


        } else {

            res.json({
                "error": true,
                "StatusCode": 301,
                "status": "error",
                "message": "No records founds."
            });

        }

    }).fetchAll().then(function(addy) {
        return addy;

    }).then(function(addy) {
        if (addy.length) {

            return bPromise.map(addy.models, function(addy) {
                var latitude = addy.get("latitude");
                var longitude = addy.get("longitude");

                //var shop_name = addy.get("shop_name");


                var endPoint = {
                    latitude: latitude,
                    longitude: longitude
                };
                var distance = ProductsServices.getDistance(startPoint, endPoint, 2);

                /*console.log("user insert distance is"+areaDist);
                console.log("ADddy lenth is "+addy.length);
                console.log("distance "+distance);*/
                if (distance <= areaDist) {
                    //console.log("ADddy lenth is "+addy.length);
                    //addy.attributes.status = 200;
                    newArray.push(addy);
                    // return addy;

                }


                //return addy;

            })
        } else {
            //return addy;

        }

    }).then(function(result) {


        if (newArray.length)
            res.json({
                "error": false,
                "task_type": task_type,
                "StatusCode": 200,
                "status": "success",
                "message": "",
                "result": newArray
            });
        else
            res.json({
                "error": true,
                "StatusCode": 200,
                "status": "error",
                "message": "No records founds.",
                "result": newArray
            });


    }).catch(function(err) {
        res.json({
            "error": true,
            "StatusCode": 200,
            "status": "error",
            "message": err.message,
            "result": err.message
        });
    });
    //}//if bracket close

};


/*exports.get_shop_by_lat_lng = function(req, res) {


    var shop = [];
    var newArray = [];
    var productsList = [];
    var startPoint = {
        latitude: req.body.lat,
        longitude: req.body.lng
    };
    //var body = req.body;
    console.log("get_product_by_lat_lng");

    var areaDist = (req.body.areaDist) ? req.body.areaDist : false;
    var customer_id = (req.body.customer_id) ? req.body.customer_id : false;
    var product_id = (req.body.product_id) ? req.body.product_id : false;
    var task_type = (req.body.task_type) ? req.body.task_type : false;

    console.log("task_type =" + task_type);

    

    //if bracket start	
    var area = adminProducts.forge().query(function(qb) {
        //
        if (task_type == 'Body' || task_type == 'Events' || task_type == 'Cleaning' || task_type == 'Sports' || task_type == 'Food') {
            qb.select('tbl_area_of_services.longitude',
                'tbl_area_of_services.latitude',
                'user.shop_name',
                'tbl_admin_product_name.product_price',
                'tbl_list_of_all_products.product_name',
                'tbl_product_details.product_id',
                'tbl_product_details.product_quantity'

            );
            qb.innerJoin('tbl_area_of_services', function() {
                this.on('tbl_area_of_services.id', '=', 'tbl_admin_product_name.shop_id')
            })
            qb.innerJoin('user', function() {
                this.on('user.id', '=', 'tbl_admin_product_name.shop_id')
            })

            qb.innerJoin('tbl_list_of_all_products', function() {
                this.on('tbl_list_of_all_products.product_id', '=', 'tbl_admin_product_name.product_id')
            })
            qb.innerJoin('tbl_product_details', function() {
                this.on('tbl_product_details.product_id', '=', 'tbl_list_of_all_products.product_id')
            })
            qb.where('tbl_list_of_all_products.product_id', '=', product_id);
            qb.andWhere({
                'tbl_product_details.customer_id': customer_id
            })
            //qb.groupBy('user.shop_name');
            //
            //qb.orderByRaw('tbl_product_details.id DESC NULLS LAST')
            qb.limit(1);
            qb.orderBy('tbl_product_details.id', 'desc')


        } else {

            res.json({
                "error": true,
                "StatusCode": 301,
                "status": "error",
                "message": "No records founds."
            });

        }

    }).fetchAll().then(function(addy) {
        return addy;

    }).then(function(addy) {
        if (addy.length) {

            return bPromise.map(addy.models, function(addy) {
                var latitude = addy.get("latitude");
                var longitude = addy.get("longitude");

                //var shop_name = addy.get("shop_name");


                var endPoint = {
                    latitude: latitude,
                    longitude: longitude
                };
                var distance = ProductsServices.getDistance(startPoint, endPoint, 2);

                
                if (distance <= areaDist) {
                    //console.log("ADddy lenth is "+addy.length);
                    //addy.attributes.status = 200;
                    newArray.push(addy);
                    // return addy;

                }


                //return addy;

            })
        } else {
            //return addy;

        }

    }).then(function(result) {


        if (newArray.length)
            res.json({
                "error": false,
                "task_type": task_type,
                "StatusCode": 200,
                "status": "success",
                "message": "",
                "result": newArray
            });
        else
            res.json({
                "error": true,
                "StatusCode": 200,
                "status": "error",
                "message": "No records founds.",
                "result": newArray
            });


    }).catch(function(err) {
        res.json({
            "error": true,
            "StatusCode": 200,
            "status": "error",
            "message": err.message,
            "result": err.message
        });
    });
    //}//if bracket close

};*/

exports.get_shop_by_lat_lng = function(req, res){


    var shop=[];
    var newArray = [];
    var productsList = [];
    var startPoint = {
        latitude:req.body.lat,
        longitude:req.body.lng
    };
    //var body = req.body;
    console.log("get_product_by_lat_lng");

    var areaDist = (req.body.areaDist)?req.body.areaDist:false;
    var customer_id = (req.body.customer_id)?req.body.customer_id:false;
    var product_id = (req.body.product_id)?req.body.product_id:false;
    var task_type = (req.body.task_type)?req.body.task_type:false;

    console.log("task_type ="+task_type);
    //if bracket start  
    var area = adminProducts.forge().query(function (qb) {
        //
     if(task_type=='Body'||task_type=='Events'||task_type=='Cleaning'||task_type=='Sports'||task_type=='Food'){
            qb.select('tbl_area_of_services.longitude',
                      'tbl_area_of_services.latitude',
                      'user.shop_name',
                      'tbl_admin_product_name.product_price',
                      'tbl_list_of_all_products.product_description',
                      'tbl_list_of_all_products.product_image as image',
                      'tbl_list_of_all_products.product_name',
                      'tbl_product_details.product_id',
                      'tbl_product_details.product_weight',
                      'tbl_product_details.product_quantity as unit'

                      );
            qb.innerJoin('tbl_area_of_services', function() {
            this.on('tbl_area_of_services.id', '=', 'tbl_admin_product_name.shop_id')
            })
            qb.innerJoin('user', function() {
            this.on('user.id', '=', 'tbl_admin_product_name.shop_id')
            })

            qb.innerJoin('tbl_list_of_all_products', function() {
            this.on('tbl_list_of_all_products.product_id', '=', 'tbl_admin_product_name.product_id')
            })
            qb.innerJoin('tbl_product_details', function() {
            this.on('tbl_product_details.product_id', '=', 'tbl_list_of_all_products.product_id')
            })
            qb.where('tbl_list_of_all_products.product_id', '=', product_id);
            qb.andWhere({'tbl_product_details.customer_id': customer_id })
            qb.groupBy('tbl_area_of_services.id');
            //
            //qb.orderByRaw('tbl_product_details.id DESC NULLS LAST')
            //qb.limit(1);
            qb.orderBy('tbl_product_details.id', 'desc')
            

        }
        else{

            res.json({"error":true,"StatusCode": 301,"status" : "error", "message" :"No records founds."});

        }
        
    }).fetchAll().then(function(addy) {
        return addy;

    }).then(function(addy){
        if(addy.length){

            return bPromise.map(addy.models, function(addy){
                var latitude = addy.get("latitude");
                var longitude = addy.get("longitude");

                //var shop_name = addy.get("shop_name");


                var endPoint = 
                {
                    latitude:latitude,
                    longitude:longitude
                };
                var distance = ProductsServices.getDistance(startPoint,endPoint,2);

                /*console.log("user insert distance is"+areaDist);
                console.log("ADddy lenth is "+addy.length);
                console.log("distance "+distance);*/
                if(distance <= areaDist){
                    //console.log("ADddy lenth is "+addy.length);
                    //addy.attributes.status = 200;
                    newArray.push(addy);
                    // return addy;
                    
                }


                //return addy;
                
            })
        }else{
           //return addy;
                
        }
        
    }).then(function(result){
        
        
           if(newArray.length)
                res.json({"error":false,"task_type":task_type,"StatusCode": 200,"status" : "success", "message" :"","result":newArray});
            else
                res.json({"error":true,"StatusCode": 200,"status" : "error", "message" :"No records founds.","result":newArray});
        

    }).catch(function(err) {
        res.json({"error":true,"StatusCode": 200,"status" : "error", "message" : err.message,"result":err.message});
    });
//}//if bracket close

};



/*exports.get_customer_product_detail = function(req, res){
	
	var customer_id = (req.query.customer_id)?req.query.customer_id:false;
	var area = user.forge().query(function (qb) {
		qb.select('tbl_product_details.product_name','tbl_product_details.product_id',
			'tbl_product_details.product_quantity','tbl_product_details.product_price','user.username','user.address','user.date');
		
		qb.innerJoin('tbl_product_details', function() {
			
			
			this.on('tbl_product_details.customer_id', '=', 'user.id')
			qb.where('tbl_product_details.admin_id', '=', customer_id)
			
			qb.andWhere({'user.status':  0})
			
		})
		
		
		
	}).fetchAll().then(function(addy) {

		return addy;

	}).then(function(addy){
		return bPromise.map(addy.models, function(addy){
		   
			return {
				product_name: addy.get("product_name"),
				product_quantity: addy.get("product_quantity"),
				product_price: addy.get("product_price")
						
			}
		})
	});

	area.then(function (area) {
		if(area.length == 0){
			var area = [];
			res.json({"error":false, status:"success but records are not present","message":"", result:area});
		}else{
			res.json({"error":false, status:"success","message":"", result:area});
		}
	})
	.catch(function(err) {
		return errors.returnError(err,res);
	});
};*/

//This web service is call when we go in accept client and then click on 
// view porduct
exports.get_customer_product_detail = function(req, res) {

    var customer_id = (req.query.customer_id) ? req.query.customer_id : false;
    //var id = (req.query.id)?req.query.id:false;
    var area = Booking.forge().query(function(qb) {
        //qb.distinct('product_name')
        qb.select('product_name', 'product_id', 'product_quantity', 'product_price');

        /*qb.innerJoin('tbl_product_details', function() {*/
        //this.on('tbl_product_details.admin_id', '=', id)
        //qb.distinct('product_name')
        qb.where('customer_id', '=', customer_id)
        qb.groupBy("product_name");


        //qb.andWhere({'tbl_product_details.customer_id':  id})
        //qb.andWhere({'user.status':  0})

        /*})*/


        //qb.where('Customer.customer_id', '=', id);
        //qb.groupBy("customer_name");
        //qb.groupBy("user.username");
    }).fetchAll().then(function(addy) {

        return addy;

    }).then(function(addy) {
        return bPromise.map(addy.models, function(addy) {

            return {

                product_name: addy.get("product_name"),
                product_quantity: addy.get("product_quantity"),
                product_price: addy.get("product_price")
                /*product_id: addy.get("product_id"),
                product_quantity: addy.get("product_quantity"),
                product_price: addy.get("product_price")	*/
            }
        })
    });

    area.then(function(area) {
            if (area.length == 0) {
                var area = [];
                res.json({
                    "error": false,
                    "StatusCode": 201,
                    status: "success but records are not present",
                    "message": "",
                    result: area
                });
            } else {
                res.json({
                    "error": false,
                    "StatusCode": 200,
                    status: "success",
                    "message": "",
                    result: area
                });
            }
        })
        .catch(function(err) {
            return errors.returnError(err, res);
        });
};

exports.listClient2 = function(req, res){

	console.log("succesfully");
	

	var shop=[];
	var productDetails = [];
	var fffff=[];
	var number=1;
	var val=1;
	var id = (req.query.id)?req.query.id:false;
	var task_type = (req.query.task_type)?req.query.task_type:false;
	var fetchParams = {withRelated:["productDetail"]};
	var Product = Products.forge().query(function (qb) {
		qb.select('tbl_product_details.product_id',
			'tbl_product_details.product_name',
			'tbl_product_details.product_quantity',
			'tbl_product_details.product_weight',
			'tbl_product_details.task_type'
			)
		qb.where('tbl_product_details.customer_id', '=', id);
		qb.andWhere({'tbl_product_details.task_type':  task_type})
		//qb.where('tbl_product_details.task_type', '=', id);
		qb.distinct('tbl_product_details.product_id');
		 
		
	}).fetchAll(fetchParams).then(function(addy) {

		if(addy.length){
			return bPromise.map(addy.models, function(addy1){

				var products = JSON.parse(addy1.relations.productDetail.get("price_details"));
				var product_weight = addy1.get("product_weight");

				///var admin_id = addy1.get("");
				var admin_id = JSON.parse(addy1.relations.productDetail.get("admin_id"));

				var product_quantity = addy1.get("product_quantity");
				console.log("product_quantity is = "+product_quantity);
				console.log("Admin id  is = "+admin_id);

				products.forEach(function(p){
					if(shop.indexOf(p.shop_name)==-1)
					shop.push(p.shop_name);
				})
				productDetails.push(addy1);
				return addy1;
			});

		}
		else{
			return res.json({"error":true,status:"error","result":addy,"message":"No shop are available."});
			//return res.json({"error":true,status:"error","result":addy1,"message":"No shop are available."});
			//(write by amey)

		}

	//}).then(function(addy1){
	}).then(function(addy){
		//console.log(productDetails);//for print in JSON form
		return bPromise.map(productDetails,function(pro){
			console.log("pro.attributespro.attributespro.attributespro.attributes");
			//console.log(pro);//for print in JSON form
			var row = '{"item":"'+pro.relations.productDetail.get("product_name")+'","shop" : [{';
			//console.log("pro inside loop quantity"+pro.get("product_weight"));


			var tempproductList = [];
			var tempshopList = [];
			var count = 0;
			
			shop.forEach(function(s){
			//	console.log("the value of s is "+s);



			var productDetails_price_details = JSON.parse(pro.relations.productDetail.get("price_details"));

			var productDetails_shops = [];
			var productDetails_price =[];
			productDetails_price_details.forEach(function(ps){

				productDetails_shops.push(ps.shop_name);
				productDetails_price.push(ps.price);

			})
			

			if(productDetails_shops.indexOf(s)!=-1){

				price = productDetails_price[productDetails_shops.indexOf(s)];
				var shopname = s.replace(/\s+/g, '');
				if(count==0){

					row +='"Name":"'+shopname+'"';
					//row +=',"Shop_id":"'+admin_id+'"';
					var final_price= (price*pro.get("product_weight"));
					row +=',"Price":"'+final_price+'"';
					row +=',"Quantity":"'+pro.get("product_quantity")+'"';
					row +=',"item":"'+pro.relations.productDetail.get("product_name")+'"';
					row +='},{';
					
				}
				else{

					row +='"Name":"'+shopname+'"';
					//row +=',"Shop_id":"'+admin_id+'"';
					var final_price= (price*pro.get("product_weight"));
					row +=',"Price":"'+final_price+'"';
					row +=',"Quantity":"'+pro.get("product_quantity")+'"';
					row +=',"item":"'+pro.relations.productDetail.get("product_name")+'"';
					row +='},{';

				}

			}else{
				price = "N.A";
				var shopname = s.replace(/\s+/g, '');
				if(count==0){

					row +='"Name":"'+shopname+'"';
					//row +=',"Shop_id":"'+admin_id+'"';
					var final_price= (price*pro.get("product_weight"));
					row +=',"Price":"N.A"';
					row +=',"Quantity":"'+pro.get("product_quantity")+'"';
					row +=',"item":"'+pro.relations.productDetail.get("product_name")+'"';

					row +='},{';

				}
				else{
				
					row +='"Name":"'+shopname+'"';
					//row +=',"Shop_id":"'+admin_id+'"';
					var final_price= (price*pro.get("product_weight"));
					row +=',"Price":"'+price+'"';
					row +=',"Quantity":"'+pro.get("product_quantity")+'"';
					row +=',"item":"'+pro.relations.productDetail.get("product_name")+'"';

					row +='},{';
				//console.log("s="+row);
				}
			}

			count=count+1;
			//}for bracket
			//}for bracket	

			});
			row += "}]}";
			row = row.replace(',{}', '')
			var f = JSON.parse(row);
			return f;
		});
	}).then(function(fresult){
	//var f = JSON.parse(fresult);
		return res.json({"shop":shop,"shopDetail":fresult});
	}).catch(function(err){
		console.log(err);
		return res.json({"error":true,status:"error","result":"","message":"Something went wrong."});
	});

}

// Pass Customer id in this  url

/*exports.offer_1 = function(req, res){
	console.log("succesfully");
	var number=1;
	var val=1;
	var id = (req.query.id)?req.query.id:false;
	var task_type = (req.query.task_type)?req.query.task_type:false;
	console.log("=====================================");
	console.log("=====================================");
	console.log("=====================================");
	console.log(task_type);
	console.log(task_type);
	console.log(task_type);
	console.log(task_type);
	console.log("customer_id is"+id );
	console.log("=====================================");
	console.log("=====================================");
	console.log("=====================================");
	
		var area = Products.forge().query(function (qb) {

		qb.select('tbl_product_details.product_id',
			'tbl_product_details.product_name',
			'tbl_product_details.product_quantity',
			'tbl_product_details.product_weight',
			'tbl_product_details.task_type'
			)
		qb.innerJoin('tbl_list_of_all_products', function() {
			this.on('tbl_product_details.product_id', '=', 'tbl_list_of_all_products.product_id')
        })

		qb.where('tbl_product_details.customer_id', '=', id);
		qb.andWhere({'tbl_product_details.task_type':  task_type})
		qb.andWhere({'tbl_product_details.status':  0})
		qb.distinct('tbl_list_of_all_products.product_id');
		qb.groupBy('tbl_list_of_all_products.product_id');
		
	}).fetchAll().then(function(addy) {
		return addy;

	}).then(function(addy){
		return bPromise.map(addy.models, function(addy){
		  
			
			return {
				
				Item_id: addy.get("product_id"),
				Item_name: addy.get("product_name"),
				
				
			}
		})
	});

	area.then(function (area) {
		if(area.length == 0){
			var area = [];
			res.json({"error":false, status:"success but records are not present","message":"", result:area});
		}else{
			res.json({"Shops":area});
		}
	})
	.catch(function(err) {
		return errors.returnError(err,res);
	});
};*/

exports.offer_1 = function(req, res) {
    console.log("succesfully");
    var number = 1;
    var val = 1;
    var id = (req.query.id) ? req.query.id : false;
    var task_type = (req.query.task_type) ? req.query.task_type : false;
    console.log("=====================================");
    console.log("=====================================");
    console.log("=====================================");
    console.log(task_type);
    console.log(task_type);
    console.log(task_type);
    console.log(task_type);
    console.log("customer_id is" + id);
    console.log("=====================================");
    console.log("=====================================");
    console.log("=====================================");

    var user = chk.forge().query(function(qb) {

        qb.select('tbl_product_details.product_id',
            'tbl_product_details.product_name',
            'tbl_product_details.product_quantity',
            'tbl_product_details.product_weight',
            'tbl_product_details.customer_id',
            'tbl_product_details.recipe_code',
            'tbl_product_details.task_type'
        )
        /*qb.innerJoin('tbl_list_of_all_products', function() {
            this.on('tbl_product_details.product_id', '=', 'tbl_list_of_all_products.product_id')
        })*/
        qb.rightJoin('tbl_product_details', function() {
            this.on('tbl_product_details.recipe_code', '=', 'tbl_chk.code')
            qb.where('tbl_product_details.customer_id', '=', id);
            qb.orderBy('tbl_chk.id', 'desc')
            qb.limit(1);
        })

   }).fetchAll().then(function(addy) {
        return addy;
    }).then(function(addy) {
        //console.log("===========Length=====================");
        //var len =addy.length;
        //console.log("============Length====================");
        return bPromise.map(addy.models, function(addy) {

            var product_name = addy.get("product_name");
            var product_weight = addy.get("product_weight");
            var product_quantity = addy.get("product_quantity");
            var customer_id = addy.get("customer_id");
            //var sum+= product_p_a;
            //var final_price = (product_price * product_quantity);
            var code = addy.get("recipe_code");
            console.log("before  wala code " + code);
            ShowCheckout_data(req, res, customer_id, code);

        })
    })

};


function ShowCheckout_data(req, res, customer_id, code) {
    //var user2=[];
    console.log("=============================");
    console.log("customer id =" + customer_id);
    console.log("code =" + code);
    console.log("=============================");
    var user2 = Products.forge().query(function(qb) {

        qb.select('*');
        qb.where('customer_id', '=', customer_id);
        qb.andWhere({
            'recipe_code': code
        })

    }).fetchAll().then(function(addy) {
        return addy;
    }).then(function(addy) {

        return bPromise.map(addy.models, function(addy) {

            //var product_price = addy.get("product_price");
            //var customer_id = addy.get("customer_id");
            //var product_quantity = addy.get("product_quantity");
            return {
                /*product_name: addy.get("product_name"),
                product_quantity: addy.get("product_quantity"),
                code: addy.get("code"),*/


                Item_id: addy.get("product_id"),
                Item_name: addy.get("product_name"),
                //product_price: addy.get("p"),
                //product_quantity: addy.get("product_quantity"),

            }

        })
    });

    user2.then(function(user2) {
            if (user2.length == 0) {
                var user2 = [];
                res.json({
                    "error": false,
                    status: "success",
                    "message": "These are result",
                    result: user2
                });
            } else {
                res.json({
                    "error": false,
                    "StatusCode": 200,
                    status: "success",
                    "message": "These are result",
                    Shops: user2
                });
            }
        })
        .catch(function(err) {
            return errors.returnError(err, res);
        });

}



    
// Pass Product id id in this  url
exports.offer_2 = function(req, res) {

    console.log("succesfully");


    var shop = [];
    var productDetails = [];
    var fffff = [];
    var number = 1;
    var val = 1;
    var id = (req.query.id) ? req.query.id : false;
    var task_type = (req.query.task_type) ? req.query.task_type : false;
    var fetchParams = {
        withRelated: ["productDetail"]
    };
    var Product = Products.forge().query(function(qb) {
        qb.select('tbl_product_details.product_id',
            'tbl_product_details.product_name',
            'tbl_product_details.product_quantity',
            'tbl_product_details.product_weight',
            'tbl_product_details.task_type'
        )
        qb.innerJoin('tbl_list_of_all_products', function() {
            this.on('tbl_product_details.product_id', '=', 'tbl_list_of_all_products.product_id')
        })

        qb.where('tbl_list_of_all_products.product_id', '=', id);
        //qb.andWhere({'tbl_product_details.task_type':  task_type})
        //qb.where('tbl_product_details.task_type', '=', id);
        qb.distinct('tbl_list_of_all_products.product_id');
        qb.limit(1);


    }).fetchAll(fetchParams).then(function(addy) {

        if (addy.length) {
            return bPromise.map(addy.models, function(addy1) {

                var products = JSON.parse(addy1.relations.productDetail.get("price_details"));
                var product_weight = addy1.get("product_weight");
                var product_name = addy1.get("product_name");

                ///var admin_id = addy1.get("");
                var admin_id = JSON.parse(addy1.relations.productDetail.get("admin_id"));

                var product_quantity = addy1.get("product_quantity");
                console.log("product_quantity is = " + product_quantity);
                console.log("Admin id  is = " + admin_id);

                products.forEach(function(p) {
                    if (shop.indexOf(p.shop_name) == -1)
                        shop.push(p.shop_name);
                })
                productDetails.push(addy1);
                return addy1;
            });

        } else {
            return res.json({
                "error": true,
                status: "error",
                "result": addy,
                "message": "No shop are available."
            });


        }


    }).then(function(addy) {

        return bPromise.map(productDetails, function(pro) {
            console.log("pro.attributespro.attributespro.attributespro.attributes");

            var row = '{"item":"' + pro.relations.productDetail.get("product_id") + '","shop" : [{';



            var tempproductList = [];
            var tempshopList = [];
            var count = 0;

            shop.forEach(function(s) {




                var productDetails_price_details = JSON.parse(pro.relations.productDetail.get("price_details"));

                var productDetails_shops = [];
                var productDetails_price = [];
                productDetails_price_details.forEach(function(ps) {

                    productDetails_shops.push(ps.shop_name);
                    productDetails_price.push(ps.price);

                })


                if (productDetails_shops.indexOf(s) != -1) {

                    price = productDetails_price[productDetails_shops.indexOf(s)];
                    shopname = productDetails_shops[productDetails_shops.indexOf(s)];
                    //var shopname = s.replace(/\s+/g, '');
                    if (count == 0) {

                        row += '"Name":"' + shopname + '"';
                        //row +=',"Shop_id":"'+admin_id+'"';

                        var final_price = (price * pro.get("product_weight"));
                        row += ',"Item_id":"' + pro.relations.productDetail.get("product_id") + '"';
                        row += ',"Item_name":"' + pro.relations.productDetail.get("product_name") + '"';
                        row += ',"Price":"' + final_price + '"';
                        row += ',"Quantity":"' + pro.get("product_quantity") + '"';
                        //row +=',"item":"'+pro.relations.productDetail.get("product_name")+'"';
                        row += '},{';

                    } else {

                        row += '"Name":"' + shopname + '"';
                        //row +=',"Shop_id":"'+admin_id+'"';
                        var final_price = (price * pro.get("product_weight"));
                        row += ',"Item_id":"' + pro.relations.productDetail.get("product_id") + '"';
                        row += ',"Item_name":"' + pro.relations.productDetail.get("product_name") + '"';
                        row += ',"Price":"' + final_price + '"';
                        row += ',"Quantity":"' + pro.get("product_quantity") + '"';
                        //row +=',"item":"'+pro.relations.productDetail.get("product_name")+'"';
                        row += '},{';

                    }

                } else {
                    price = "N.A";
                    var shopname = s.replace(/\s+/g, '');
                    if (count == 0) {

                        row += '"Name":"' + shopname + '"';
                        //row +=',"Shop_id":"'+admin_id+'"';
                        var final_price = (price * pro.get("product_weight"));
                        row += ',"Item_id":"' + pro.relations.productDetail.get("product_id") + '"';
                        row += ',"Item_name":"' + pro.relations.productDetail.get("product_name") + '"';
                        row += ',"Price":"N.A"';
                        row += ',"Quantity":"' + pro.get("product_quantity") + '"';
                        //row +=',"item":"'+pro.relations.productDetail.get("product_name")+'"';

                        row += '},{';

                    } else {

                        row += '"Name":"' + shopname + '"';
                        //row +=',"Shop_id":"'+admin_id+'"';
                        var final_price = (price * pro.get("product_weight"));
                        row += ',"Item_id":"' + pro.relations.productDetail.get("product_id") + '"';
                        row += ',"Item_name":"' + pro.relations.productDetail.get("product_name") + '"';
                        row += ',"Price":"' + price + '"';
                        row += ',"Quantity":"' + pro.get("product_quantity") + '"';
                        //row +=',"item":"'+pro.relations.productDetail.get("product_name")+'"';

                        row += '},{';
                        //console.log("s="+row);
                    }
                }

                count = count + 1;
                //}for bracket
                //}for bracket	

            });
            row += "}]}";
            row = row.replace(',{}', '')
            var f = JSON.parse(row);
            return f;
        });
    }).then(function(fresult) {
        //var f = JSON.parse(fresult);
        return res.json({
            "shopDetail": fresult
        });
    }).catch(function(err) {
        console.log(err);
        return res.json({
            "error": true,
            status: "error",
            "result": "",
            "message": "Something went wrong."
        });
    });

}




/*Final acc DP sir */




/*Guide by ishan sir start */
exports.listClient2 = function(req, res) {

    console.log("succesfully");


    var shop = [];
    var productDetails = [];
    var fffff = [];
    var number = 1;
    var val = 1;
    var id = (req.query.id) ? req.query.id : false;
    var task_type = (req.query.task_type) ? req.query.task_type : false;
    var fetchParams = {
        withRelated: ["productDetail"]
    };
    var Product = Products.forge().query(function(qb) {
        qb.select('tbl_product_details.product_id',
            'tbl_product_details.product_name',
            'tbl_product_details.product_quantity',
            'tbl_product_details.product_weight',
            'tbl_product_details.task_type'
        )
        qb.where('tbl_product_details.customer_id', '=', id);
        qb.andWhere({
            'tbl_product_details.task_type': task_type
        })
        //qb.where('tbl_product_details.task_type', '=', id);
        qb.distinct('tbl_product_details.product_id');

    }).fetchAll(fetchParams).then(function(addy) {

        if (addy.length) {
            return bPromise.map(addy.models, function(addy1) {

                var products = JSON.parse(addy1.relations.productDetail.get("price_details"));
                var product_weight = addy1.get("product_weight");
                var product_quantity = addy1.get("product_quantity");
                console.log("product_quantity is = " + product_quantity);

                products.forEach(function(p) {
                    if (shop.indexOf(p.shop_name) == -1)
                        shop.push(p.shop_name);
                })
                productDetails.push(addy1);
                return addy1;
            });

        } else {
            return res.json({
                "error": true,
                status: "error",
                "result": addy,
                "message": "No shop are available."
            });
            //return res.json({"error":true,status:"error","result":addy1,"message":"No shop are available."});
            //(write by amey)

        }

        //}).then(function(addy1){
    }).then(function(addy) {
        console.log(productDetails);
        return bPromise.map(productDetails, function(pro) {
            console.log("pro.attributespro.attributespro.attributespro.attributes");
            console.log(pro);
            var row = '{"item":"' + pro.relations.productDetail.get("product_name") + '","shop" : [{';
            //console.log("pro inside loop quantity"+pro.get("product_weight"));


            var tempproductList = [];
            var tempshopList = [];
            var count = 0;

            shop.forEach(function(s) {
                console.log("the value of s is " + s);



                var productDetails_price_details = JSON.parse(pro.relations.productDetail.get("price_details"));

                var productDetails_shops = [];
                var productDetails_price = [];
                productDetails_price_details.forEach(function(ps) {

                    productDetails_shops.push(ps.shop_name);
                    productDetails_price.push(ps.price);

                })


                if (productDetails_shops.indexOf(s) != -1) {

                    price = productDetails_price[productDetails_shops.indexOf(s)];
                    var shopname = s.replace(/\s+/g, '');
                    if (count == 0) {

                        row += '"Name":"' + shopname + '"';
                        var final_price = (price * pro.get("product_weight"));
                        row += ',"Price":"' + final_price + '"';
                        row += ',"Quantity":"' + pro.get("product_quantity") + '"';
                        row += ',"item":"' + pro.relations.productDetail.get("product_name") + '"';
                        row += '},{';

                    } else {

                        row += '"Name":"' + shopname + '"';
                        var final_price = (price * pro.get("product_weight"));
                        row += ',"Price":"' + final_price + '"';
                        row += ',"Quantity":"' + pro.get("product_quantity") + '"';
                        row += ',"item":"' + pro.relations.productDetail.get("product_name") + '"';
                        row += '},{';

                    }

                } else {
                    price = "N.A";
                    var shopname = s.replace(/\s+/g, '');
                    if (count == 0) {

                        row += '"Name":"' + shopname + '"';
                        var final_price = (price * pro.get("product_weight"));
                        row += ',"Price":"N.A"';
                        row += ',"Quantity":"' + pro.get("product_quantity") + '"';
                        row += ',"item":"' + pro.relations.productDetail.get("product_name") + '"';

                        row += '},{';

                    } else {

                        row += '"Name":"' + shopname + '"';
                        var final_price = (price * pro.get("product_weight"));
                        row += ',"Price":"' + price + '"';
                        row += ',"Quantity":"' + pro.get("product_quantity") + '"';
                        row += ',"item":"' + pro.relations.productDetail.get("product_name") + '"';

                        row += '},{';
                        //console.log("s="+row);
                    }
                }

                count = count + 1;
                //}for bracket
                //}for bracket	

            });
            row += "}]}";
            row = row.replace(',{}', '')
            var f = JSON.parse(row);
            return f;
        });
    }).then(function(fresult) {
        //var f = JSON.parse(fresult);
        return res.json({
            "shop": shop,
            "shopDetail": fresult
        });
    }).catch(function(err) {
        console.log(err);
        return res.json({
            "error": true,
            status: "error",
            "result": "",
            "message": "Something went wrong."
        });
    });

}

/*Guide by ishan sir end */

/* old wala  quantity missing start*/
/*exports.listClient2 = function(req, res){

console.log("succesfully  listClient2");
 	var shop=[];
 	var productDetails;
 	var fffff=[];
 	var number=1;
	var id = (req.query.id)?req.query.id:false;
	var fetchParams = {withRelated:["productDetail"]};
	var Product = Products.forge().query(function (qb) {
		qb.where('tbl_product_details.customer_id', '=', id);
		
		
	}).fetchAll(fetchParams).then(function(addy) {
		
			if(addy.length){
				productDetails = addy;

				return bPromise.map(addy.models, function(addy){

					var products = JSON.parse(addy.relations.productDetail.get("price_details"));
					products.forEach(function(p){
					if(shop.indexOf(p.shop_name)==-1)
					shop.push(p.shop_name);
					})
					return addy;
				});

			}
			else{
				return res.json({"error":true,status:"error","result":addy,"message":"No shop are available."});

			}
		
	}).then(function(addy){
		
			return bPromise.map(productDetails.models,function(pro){
				
				var row = '{"item":"'+pro.relations.productDetail.get("product_name")+'","shop" : [{';
				

				var tempproductList = [];
				var tempshopList = [];
				var count = 0;
				shop.forEach(function(s){

				

				var productDetails_price_details = JSON.parse(pro.relations.productDetail.get("price_details"));
				
				var productDetails_shops = [];
				var productDetails_price =[];
				productDetails_price_details.forEach(function(ps){

					productDetails_shops.push(ps.shop_name);
					productDetails_price.push(ps.price);

				})
				if(productDetails_shops.indexOf(s)!=-1){

					price = productDetails_price[productDetails_shops.indexOf(s)];
					var shopname = s.replace(/\s+/g, '');
					if(count>0){
						console.log("If me If Number"+number);
						
						number++;
						row +='"Name":"'+shopname+'"';
						row +=',"Price":"'+price+'"';
						row +=',"item":"'+pro.relations.productDetail.get("product_name")+'"';
						
						row +='},{';
						console.log()

					}
					else{

						console.log("If me else Number"+number);
						number++;
						row +='"Name":"'+shopname+'"';
						row +=',"Price":"'+price+'"';
						row +=',"item":"'+pro.relations.productDetail.get("product_name")+'"';
						
						row +='},{';
					
					}

				}else{


					price = "N.A";
					var shopname = s.replace(/\s+/g, '');
					if(count>0){
						console.log("else me if Number"+number);
						number++;

						row +='"Name":"'+shopname+'"';
						row +=',"Price":"'+price+'"';
						row +=',"item":"'+pro.relations.productDetail.get("product_name")+'"';
						
						row +='},{';

					}
					else{
						console.log("else me else Number"+number);
						number++;
						row +='"Name":"'+shopname+'"';
						row +=',"Price":"'+price+'"';
						row +=',"item":"'+pro.relations.productDetail.get("product_name")+'"';
						
						row +='},{';
					
					}
				}
					count=count+1;

				});
				row += "}]}";
				row = row.replace(',{}', '')
				console.log("the final rows are ="+row);
				
				var f = JSON.parse(row);
				
				return f;

			});
	}).then(function(fresult){
		
		 return res.json({"shop":shop,"shopDetail":fresult});
	}).catch(function(err){
		console.log(err);
		return res.json({"error":true,status:"error","result":"","message":"Something went wrong."});
	});
	


 }*/
/* old wala  quantity missing end*/

/*exports.listClient2 = function(req, res){
 	console.log("succesfully");
 	var shop=[];
 	var productDetails;
 	var fffff=[];
	var id = (req.query.id)?req.query.id:false;
	var fetchParams = {withRelated:["productDetail"]};
	var Product = Products.forge().query(function (qb) {
		qb.where('tbl_product_details.customer_id', '=', id);
		
		
	}).fetchAll(fetchParams).then(function(addy) {
		
			if(addy.length){
				productDetails = addy;


				return bPromise.map(addy.models, function(addy){

					var products = JSON.parse(addy.relations.productDetail.get("price_details"));
					products.forEach(function(p){
					if(shop.indexOf(p.shop_name)==-1)
					shop.push(p.shop_name);
					})
					return addy;
				});

			}
		else{
			return res.json({"error":true,status:"error","result":addy,"message":"No shop are available."});

		}
		
	}).then(function(addy){
		
			return bPromise.map(productDetails.models,function(pro){
				var row = '{"item":"'+pro.relations.productDetail.get("product_name")+'",';

				var tempproductList = [];
				var tempshopList = [];
				var count = 0;
				shop.forEach(function(s){

				
				var productDetails_price_details = JSON.parse(pro.relations.productDetail.get("price_details"));
				
				var productDetails_shops = [];
				var productDetails_price =[];
				productDetails_price_details.forEach(function(ps){

					productDetails_shops.push(ps.shop_name);
					productDetails_price.push(ps.price);

				})
				if(productDetails_shops.indexOf(s)!=-1){

					price = productDetails_price[productDetails_shops.indexOf(s)];
					var shopname = s.replace(/\s+/g, '');
					if(count==0)
					row +='"'+shopname+'":"'+price+'"';
					else
					row +=',"'+shopname+'":"'+price+'"';
					console.log("s="+row);

				}else{

					price = "N.A";
					var shopname = s.replace(/\s+/g, '');
					if(count==0)
					row +='"'+shopname+'":"'+price+'"';
					else
					row +=',"'+shopname+'":"'+price+'"';
					console.log("s="+row);
				}
					count=count+1;

				});
				row += "}";
				var f = JSON.parse(row);
				return f;

			});
	}).then(function(fresult){
		
		 return res.json({"shop":shop,"shopDetail":fresult});
	}).catch(function(err){
		console.log(err);
		return res.json({"error":true,status:"error","result":"","message":"Something went wrong."});
	});
	


 }*/



exports.listClient1 = function(req, res) {

    var id = (req.query.id) ? req.query.id : false;
    console.log("The loop is working and the send id is " + id)

    var area = Products.forge().query(function(qb) {
        qb.select('customer_id', 'product_name', 'product_quantity', 'product_weight');
        /*qb.innerJoin('Customer', function() {
        	this.on('Customer.customer_id', '=', 'Products.customer_id')*/
        //qb.where('Customer.customer_id', '=', 'Products.'id);
        //qb.where('Customer.customer_id', '=', 'Products.customer_id');
        //this.on('clientOrganization.client_id', '=', 721)
        //})
        /*qb.leftJoin('ClientHeathRecord', function() {
        	this.on('ClientHeathRecord.UserId', '=', 'User.Id')
        	//this.on('ClientHeathRecord.UserId', '=', 721)
        })*/
        //qb.count('product_name');
        qb.where('customer_id', '=', id);
        //qb.groupBy("customer_name");
        //qb.groupBy("Customer.customer_id");
    }).fetchAll().then(function(addy) {
        return addy;
    }).then(function(addy) {
        return bPromise.map(addy.models, function(addy) {

            //var dateC = moment(addy.get("date"));
            //var dateB = moment(myDate);
            return {

                product_name: addy.get("product_name"),
                product_quantity: addy.get("product_quantity"),
                product_weight: addy.get("product_weight"),
                customer_id: addy.get("customer_id")

                /*customer_name: addy.get("customer_name"),
                product_name: addy.get("product_name"),
                months: dateB.diff(dateC, 'months')*/

            }
        })
    });

    area.then(function(area) {
            if (area.length == 0) {
                var area = [];
                res.json({
                    "error": false,
                    status: "success",
                    "message": "",
                    result: area
                });
            } else {
                res.json({
                    "error": false,
                    status: "success",
                    "message": "",
                    result: area
                });
            }
        })
        .catch(function(err) {
            return errors.returnError(err, res);
        });
};


exports.getArea = function(req, res) {

    var id = (req.query.id) ? req.query.id : false;

    var area = Products.forge().query(function(qb) {
        qb.select('date', 'address', 'customer_id');
        /*qb.innerJoin('Customer', function() {
        	this.on('Customer.customer_id', '=', 'Products.customer_id')*/
        //qb.where('Customer.customer_id', '=', 'Products.'id);
        //qb.where('Customer.customer_id', '=', 'Products.customer_id');
        //this.on('clientOrganization.client_id', '=', 721)
        //})
        /*qb.leftJoin('ClientHeathRecord', function() {
        	this.on('ClientHeathRecord.UserId', '=', 'User.Id')
        	//this.on('ClientHeathRecord.UserId', '=', 721)
        })*/
        qb.count('product_name');
        qb.where('customer_id', '=', id);
        qb.groupBy("customer_name");
        //qb.groupBy("Customer.customer_id");
    }).fetchAll().then(function(addy) {
        return addy;
    }).then(function(addy) {
        return bPromise.map(addy.models, function(addy) {

            var dateC = moment(addy.get("date"));
            var dateB = moment(myDate);
            return {
                customer_id: addy.get("customer_id"),
                customer_name: addy.get("customer_name"),
                product_name: addy.get("product_name"),
                months: dateB.diff(dateC, 'months')

            }
        })
    });

    area.then(function(area) {
            if (area.length == 0) {
                var area = [];
                res.json({
                    "error": false,
                    "StatusCode": 200,
                    status: "success",
                    "message": "",
                    result: area
                });
            } else {
                res.json({
                    "error": false,
                    "StatusCode": 200,
                    status: "success",
                    "message": "",
                    result: area
                });
            }
        })
        .catch(function(err) {
            return errors.returnError(err, res);
        });
};




exports.search_my_product = function(req, res) {
    var product_name = (req.body.product_name) ? req.body.product_name : false;
    var task_type1 = (req.body.task_type) ? req.body.task_type : false;
    console.log("This is a get area ");
    var area = Products_list.forge().query(function(qb) {
        //qb.select('area_id','location');
        qb.select('product_name', 'product_id')
        qb.distinct('product_name');
        //qb.where('product_name', 'like',product_name+'%');
        //qb.where('product_name', 'like',product_name+'%');
        qb.andWhere({
            'task_type': task_type1
        })
        //qb.distinct('product_name');
    }).fetchAll().then(function(addy) {
        return addy;
    });

    area.then(function(area) {
            if (area.models.length == 0) {
                var area = [];
                //res.json(area);


                res.json({
                    "error": true,
                    status: "error",
                    "message": "No records are found ",
                    result: area
                });
            } else {

                res.json({
                    "error": false,
                    status: "success",
                    task_type: task_type1,
                    "message": "",
                    result: area
                });
            }
            //res.json(area);
        })
        .catch(function(err) {
            return errors.returnError(err, res);
        });
};


exports.add_customer_product_list = function(req, res) {
    var customer_id = (req.query.customer_id) ? req.query.customer_id : false;
    //var id = (req.query.id)?req.query.id:false;
    var area = Products.forge().query(function(qb) {
        qb.select('product_name', 'product_id', 'product_quantity', 'product_price');

        /*qb.innerJoin('tbl_product_details', function() {*/
        //this.on('tbl_product_details.admin_id', '=', id)
        qb.where('customer_id', '=', customer_id)
        //qb.andWhere({'tbl_product_details.customer_id':  id})
        qb.andWhere({
            'status': 0
        })

        /*})*/


        //qb.where('Customer.customer_id', '=', id);
        //qb.groupBy("customer_name");
        //qb.groupBy("user.username");
    }).fetchAll().then(function(addy) {

        return addy;

    }).then(function(addy) {
        return bPromise.map(addy.models, function(addy) {

            return {
                product_name: addy.get("product_name"),
                product_quantity: addy.get("product_quantity"),
                product_price: addy.get("product_price")
                /*product_id: addy.get("product_id"),
                product_quantity: addy.get("product_quantity"),
                product_price: addy.get("product_price")	*/
            }
        })
    });

    area.then(function(area) {
            if (area.length == 0) {
                var area = [];
                res.json({
                    "error": false,
                    "StatusCode": 201,
                    status: "success but records are not present",
                    "message": "",
                    result: area
                });
            } else {
                res.json({
                    "error": false,
                    "StatusCode": 200,
                    status: "success",
                    "message": "",
                    result: area
                });
            }
        })
        .catch(function(err) {
            return errors.returnError(err, res);
        });
};


exports.getClient1 = function(req, res) {
    var code = randomValueHex(7)
    var contact_no = (req.body.contact_no) ? req.body.contact_no : false;
    var userType = (req.body.userType) ? req.body.userType : false;
    var user = User.forge().query(function(qb) {
        qb.select('Id', 'password', 'username', 'email', 'contact_no', 'code', 'userType');

        qb.where('contact_no', '=', contact_no);
        qb.orWhere({
            email: contact_no
        })
    }).fetchAll().then(function(addy) {
        return addy;
    }).then(function(addy) {

        return bPromise.map(addy.models, function(addy) {
            var contact_no = addy.get("contact_no");
            var userType_data = addy.get("userType");

            console.log("the mobile no is " + contact_no);
            var code = addy.get("code");

            /*request("http://apivm.valuemobo.com/SMS/SMS_ApiKey.asmx/SMS_APIKeyNUC?apiKey=25EJ1QKsnIKh3pT&cellNoList="+contact_no+"&msgText=This is a otp number please insert this number "+code+"&senderId=OCEANP", function (error, response, body) {if (!error && response.statusCode == 200) {
        	console.log(body); 
    				}
					})*/
            return {


                username: addy.get("username"),
                contact_no: addy.get("contact_no"),

            }




        })
    });

    user.then(function(user) {
            if (user.length == 0) {

                var user = [];
                res.json({
                    "error": false,
                    status: "success",
                    "message": "User mobile no is not registered",
                    result: user
                });
            } else {
                return ClientServices.code_update(contact_no, code).then(function(Customer) {
                    if (Customer) {

                        res.json({
                            "error": false,
                            "StatusCode": 200,
                            status: "success",
                            "message": "Message is send mobile no ",
                            result: user
                        });

                    } else {
                        res.json({
                            "StatusCode": 301,
                            "result": "Something happened wrong.",
                            "ResponseMessage": "Something happened wrong."
                        });
                    }
                })
                res.json({
                    "error": false,
                    "StatusCode": 200,
                    status: "success",
                    "message": "Message is send mobile no ",
                    result: user
                });
            }
        })
        .catch(function(err) {
            return errors.returnError(err, res);
        });
};



exports.add_product_in_shopping_list = function(req, res) {
    console.log(req.query.customer_id);
    return ProductsServices.add_product_in_shopping_list(req.query.customer_id).then(function(result) {
        if (result)

            res.json({
                "StatusCode": 200,
                "result": result,
                "ResponseMessage ": "Hello your records are update  successfully"
            });

        else
            res.json({
                "StatusCode": 301,
                "result": result,
                "ResponseMessage": "Something went wrong"
            });

    }).catch(function(err) {
        console.log(err);
        res.json({
            "StatusCode": err.status,
            "result": [],
            "ResponseMessage": err.messages
        });
    });


}

function randomValueHex(len) {
    return crypto.randomBytes(Math.ceil(len / 2))
        .toString('hex') // convert to hexadecimal format
        .slice(0, len); // return required number of characters
}



/*exports.add = function(req, res){
    
    

    var pro=req.body;
    var pro1 = pro.productData1;	
    var pro2 = pro.productData2;	
    var code = randomValueHex(7)
	console.log(req.body);
    var product_title = (req.body.product_title)?req.body.product_title:false;
    var product_description = (req.body.product_description)?req.body.product_description:false;
	var date = (req.body.date)?req.body.date:false;
	var task_type = (req.body.task_type)?req.body.task_type:false;
	var type = (req.body.type)?req.body.type:false;
		console.log("title"+product_title);
		console.log("product_description"+product_description);
		console.log("date"+date);
		console.log("task_type"+task_type);
		console.log("type"+type);
		
	
	    var RecipesData = new Recipes({
        "product_title":product_title,
        "product_description":product_description,
        "date":date,
        "task_type":task_type,
        "type":type,
        "recipe_code":code,
        
                
  		});
       
	  RecipesData.save(null).tap(function (model){
	  RecipesData = model;
        
      }).then(function(RecipesData){
        }).catch(function(err){
      return err;
      });	
    
    for ( var i in pro2) {		

		var product_name = pro2[i].product_name;
		var product_price = pro2[i].product_price;
		var product_quantity = pro2[i].product_quantity;
		console.log(product_name);
		console.log(product_title);
	
	    var ProductsData = new Products({
        "product_name":product_name,
        "product_price":product_price,
        "product_quantity":product_quantity,
        "recipe_code":code,
                
  		});
      if(product_name=="" && product_price=="" && product_quantity=="")
      {
		res.json({"StatusCode": 200,"Products_": Products,"ResponseMessage": "Blank records are inserted !!"});


      }
	  ProductsData.save(null).tap(function (model){
	  ProductsData = model;
        res.json({"StatusCode": 200,"Products_": Products,"ResponseMessage": "successfully added !!"});
      }).then(function(ProductsData){
       res.json({"StatusCode": 200,"Products_": Products,"ResponseMessage": "successfully added !!"});
      }).catch(function(err){
      return err;
      });	
    }
 

};*/


/*exports.add = function(req, res){
    
    

    var pro=req.body;
    var pro1 = pro.productData1;	
    var pro2 = pro.productData2;	
    var code = randomValueHex(7)
	console.log(req.body);
    var product_title = (req.body.product_title)?req.body.product_title:false;
    var product_description = (req.body.product_description)?req.body.product_description:false;
	var date = (req.body.date)?req.body.date:false;
	var task_type = (req.body.task_type)?req.body.task_type:false;
	var type = (req.body.type)?req.body.type:false;
		console.log("title"+product_title);
		console.log("product_description"+product_description);
		console.log("date"+date);
		console.log("task_type"+task_type);
		console.log("type"+type);
		
	
	    var RecipesData = new Recipes({
        "product_title":product_title,
        "product_description":product_description,
        "date":date,
        "task_type":task_type,
        "type":type,
        "recipe_code":code,
        
                
  		});
       
	  RecipesData.save(null).tap(function (model){
	  RecipesData = model;
        
      }).then(function(RecipesData){
        }).catch(function(err){
      return err;
      });	
    
    for ( var i in pro2) {		

		var product_name = pro2[i].product_name;
		var product_price = pro2[i].product_price;
		var product_quantity = pro2[i].product_quantity;
		console.log(product_name);
		console.log(product_title);
	
	    var ProductsData = new Products({
        "product_name":product_name,
        "product_price":product_price,
        "product_quantity":product_quantity,
        "recipe_code":code,
                
  		});
      if(product_name=="" && product_price=="" && product_quantity=="")
      {
		res.json({"StatusCode": 200,"Products_": Products,"ResponseMessage": "Blank records are inserted !!"});


      }
	  ProductsData.save(null).tap(function (model){
	  ProductsData = model;
        res.json({"StatusCode": 200,"Products_": Products,"ResponseMessage": "successfully added !!"});
      }).then(function(ProductsData){
       res.json({"StatusCode": 200,"Products_": Products,"ResponseMessage": "successfully added !!"});
      }).catch(function(err){
      return err;
      });	
    }
 

};
*/
/* Below code is work for arun */

/*exports.add = function(req, res){


 	
    console.log("add pro");
    var pro=req.body;
    var pro2 = pro.productData2;	
    var code = randomValueHex(7)  

    console.log("The pro 2 is ="+ pro.productData2);
    console.log("And now pro 2 will be ="+ pro2);

    

    var product_title = (req.body.product_title)?req.body.product_title:false;
    var product_description = (req.body.product_description)?req.body.product_description:false;
  	var date = (req.body.date)?req.body.date:false;
  	var task_type = (req.body.task_type)?req.body.task_type:false;
  	var type = (req.body.type)?req.body.type:false;
	
	console.log("title"+product_title);
	console.log("product_description"+product_description);
	console.log("date"+date);
	console.log("task_type"+task_type);
	console.log("type"+type);
		
	
	var RecipesData = new Recipes({
		"product_title":product_title,
		"product_description":product_description,
		"date":date,
		"task_type":task_type,
		"type":type,
		"recipe_code":code    
	});
      
	RecipesData.save(null).tap(function (model){
		RecipesData = model;
	}).then(function(RecipesData){
	}).catch(function(err){
		console.log("error 2");
		return err;
	});
   

    
	console.log("pro2pro2pro2pro2pro2");
	console.log(pro2);
    var p_data = JSON.parse(pro2);

	
	

	bPromise.each(p_data, function(elements) {
	console.log("Promise loop ");
	console.log("The elements are "+elements);	
    //return element+'.';
   
	}).then(function(pro2) {
    console.dir(pro2);

    for ( var i=0 ;i<=pro2.length ;i++) {
		var product_name = pro2[i].product_name;
		var product_price = pro2[i].product_price;
		var product_quantity = pro2[i].product_quantity;

		console.log("pro name ="+product_name);
		console.log("pro price ="+product_price);
		console.log("pro quanitity ="+product_quantity);

		var ProductsData = new Products({
			"product_name":product_name,
			"product_price":product_price,
			"product_quantity":product_quantity,
			"recipe_code":code,
		});
		ProductsData.save(null).tap(function (model){
			ProductsData = model;
			console.log("The product data is "+ProductsData);
			
		}).then(function(ProductsData){
			res.json({"StatusCode": 200,"Products_": Products,"ResponseMessage": "successfully added !!"});
		}).catch(function(err){
			
		});	

		
	}
	});
};*/
/* Above code is work for arun */




/*exports.add = function(req, res){
    console.log("add pro");
    

    var pro=req.body;
    var pro1 = pro.productData1;	
    var pro2 = pro.productData2;	
    var code = randomValueHex(7)

    
    var product_title = (req.body.product_title)?req.body.product_title:false;
    var product_description = (req.body.product_description)?req.body.product_description:false;
	var date = (req.body.date)?req.body.date:false;
	var task_type = (req.body.task_type)?req.body.task_type:false;
	var type = (req.body.type)?req.body.type:false;
    
   // for ( var i in pro1) {	
	
		
		
		console.log(product_name);
		console.log(product_title);


		console.log("title"+product_title);
		console.log("product_description"+product_description);
		console.log("date"+date);
		console.log("task_type"+task_type);
		console.log("type"+type);
		
	
	    var RecipesData = new Recipes({
        "product_title":product_title,
        "product_description":product_description,
        "date":date,
        "task_type":task_type,
        "type":type,
        "recipe_code":code,
        
                
  		});
      
	  RecipesData.save(null).tap(function (model){
	  RecipesData = model;
          }).then(function(RecipesData){
          }).catch(function(err){
      return err;
      });
    //}  	
    
    for ( var i in pro2) {		

		var product_name = pro2[i].product_name;//oil
		var product_price = pro2[i].product_price;//price of product
		var product_quantity = pro2[i].product_quantity;//product quantity
		console.log(product_name);
		console.log(product_title);
	
	    var ProductsData = new Products({
        "product_name":product_name,
        "product_price":product_price,
        "product_quantity":product_quantity,
        "recipe_code":code,
                
  		});
      
	  ProductsData.save(null).tap(function (model){
	  ProductsData = model;
        res.json({"StatusCode": 200,"Products_": Products,"ResponseMessage": "successfully added !!"});
      }).then(function(ProductsData){
       res.json({"StatusCode": 200,"Products_": Products,"ResponseMessage": "successfully added !!"});
      }).catch(function(err){
      return err;
      });	
    }
 

};
*/

/*exports.add = function(req, res){
    console.log("add pro");

    var code = randomValueHex(7)
	var product_title = (req.body.product_title)?req.body.product_title:false;
    var product_description = (req.body.product_description)?req.body.product_description:false;
	var date = (req.body.date)?req.body.date:false;
	var task_type = (req.body.task_type)?req.body.task_type:false;
	var type = (req.body.type)?req.body.type:false;


	var product_name = (req.body.product_name)?req.body.product_name:false;
    var product_quantity = (req.body.product_quantity)?req.body.product_quantity:false;
	var product_weight = (req.body.product_weight)?req.body.product_weight:false;
	var customer_id = (req.body.product_weight)?req.body.customer_id:false;
	
    var RecipesData = new Recipes({
        "product_title":product_title,
        "product_description":product_description,
        "date":date,
        "task_type":task_type,
        "type":type,
        "recipe_code":code,
        
                
  		});
      
	  RecipesData.save(null).tap(function (model){
	  RecipesData = model;
          }).then(function(RecipesData){
          }).catch(function(err){
      return err;
      });	

    var ProductsData = new Products({
    "product_name":product_name,
    "product_weight":product_weight,
    "product_quantity":product_quantity,
    "recipe_code":code,
    "customer_id":customer_id,
                
  		});
      
	  ProductsData.save(null).tap(function (model){
	  ProductsData = model;
        res.json({"StatusCode": 200,"Products_": Products,"ResponseMessage": "successfully added !!"});
      }).then(function(ProductsData){
       res.json({"StatusCode": 200,"Products_": Products,"ResponseMessage": "successfully added !!"});
      }).catch(function(err){
      return err;
      });	
    }*/




exports.add_customer_product_list = function(req, res) {

    var customer_id = (req.query.customer_id) ? req.query.customer_id : false;
    var user = Products.forge().query(function(qb) {
        qb.select('product_id', 'customer_id', 'product_name', 'product_weight', 'status', 'product_quantity');

        qb.where('customer_id', '=', customer_id);
        qb.andWhere({
            status: 0
        })
    }).fetchAll().then(function(addy) {
        return addy;
    }).then(function(addy) {

        return bPromise.map(addy.models, function(addy) {
            return {
                product_id: addy.get("product_id"),
                customer_id: addy.get("customer_id"),
                product_name: addy.get("product_name"),
                product_weight: addy.get("product_weight"),
                status: addy.get("status"),
                product_quantity: addy.get("product_quantity"),
            }

        })
    });

    user.then(function(user) {
            if (user.length == 0) {

                var user = [];
                res.json({
                    "error": false,
                    "StatusCode": 201,
                    status: "success",
                    "message": "No Products are added now",
                    result: user
                });
            } else {

                if (user) {

                    res.json({
                        "error": false,
                        "StatusCode": 200,
                        status: "success",
                        "message": "All products list."
                    });
                } else {

                    res.json({
                        "StatusCode": 301,
                        "result": "Something happened wrong.",
                        "ResponseMessage": "Something happened wrong."
                    });
                }

                res.json({
                    "error": false,
                    "StatusCode": 301,
                    status: "success",
                    "message": "Products are not add in shopping list."
                });

            }
        })
        .catch(function(err) {
            return errors.returnError(err, res);
        });
};

exports.deleteProduct = function(req, res) {
    var product_id = req.query.product_id;
    return orm.bookshelf.transaction(function(trx) {
        return ProductsServices.deleteProduct(product_id).then(function(formate) {
            return formate;
        }).then(function(formate) {}).catch(function(err) {
            return errors.returnError(err, res);
        });
    }).then(function(invi) {
        //res.json({"success":true,"message":"invoice formate created successfully.","data":invi});
        res.json({
            "error": false,
            "StatusCode": 200,
            "status": "success",
            "message": "Record  deleted successfully.",
            "result": invi
        });
    }).catch(function(err) {
        return errors.returnError(err, res);
    });

}

//};

/* Below code is work for both add food */



exports.getAllProducts = function(req, res) {
    console.log("getAllProducts");
    return ProductsServices.getAllProducts().then(function(result) {
        console.log(result);
        if (result.length) {
            res.json({
                "StatusCode": 200,
                "Products_": result,
                "ResponseMessage": ""
            });
        } else {
            res.json({
                "StatusCode": 301,
                "Products_": [],
                "ResponseMessage": "No record found."
            });
        }
    }).catch(function(err) {
        res.json({
            "StatusCode": err.status,
            "StatusCode": 302,
            "Products_": [],
            "ResponseMessage": err.messages
        });
    })
}