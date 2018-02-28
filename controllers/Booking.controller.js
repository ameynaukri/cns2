var config = require('../config'),
    Address = require('../models/Address.model'),
    BookProducts = require('../models/Booking.model'),
    Products = require('../models/Products.model'),


    Recipes = require('../models/Recipes.model'),
    user = require('../models/user.model'),
    chk = require('../models/ShowCheckout.model'),
    Gate_way = require('../models/Gate_way.model'),
    helperServices = require('../services/helper.service'),
    moment = require('moment'),
    moment_tz = require('moment-timezone');
var bPromise = require('bluebird');
var DateDiff = require('date-diff');
var crypto = require('crypto');

var orm = require('../orm');


function randomValueHex(len) {
    return crypto.randomBytes(Math.ceil(len / 2))
        .toString('hex') // convert to hexadecimal format
        .slice(0, len); // return required number of characters
}

// check out 
exports.checkout = function(req, res) {
    var user1 = [];
    var customer_id = (req.query.customer_id) ? req.query.customer_id : false;
    var task_type = (req.query.task_type) ? req.query.task_type : false;
    var user = chk.forge().query(function(qb) {

        /*qb.select('*');
        qb.where('customer_id', '=', customer_id);
        qb.andWhere({'task_type': task_type })*/
        qb.select('tbl_booking.customer_id',
            'tbl_booking.product_price',
            'tbl_booking.product_name',
            'tbl_booking.code',
            'tbl_booking.product_quantity');
        qb.rightJoin('tbl_booking', function() {
            this.on('tbl_booking.code', '=', 'tbl_chk.code')
            qb.where('tbl_booking.customer_id', '=', customer_id);
            qb.orderBy('tbl_chk.id', 'desc')
            qb.limit(1);
            //qb.where('tbl_chk.customer_id', '=', customer_id);
            //qb.andWhere({'tbl_chk.customer_id': customer_id })
            //qb.andWhere({'tbl_product_details.task_type': 'Food' })
        })
        //qb.andWhere({'tbl_product_details.status':  0})

        //qb.sum('product_price as p')
        /*qb.select('*');
        qb.where('customer_id', '=', customer_id);
        qb.sum('product_price as p')*/

    }).fetchAll().then(function(addy) {
        return addy;
    }).then(function(addy) {
        //console.log("===========Length=====================");
        //var len =addy.length;
        //console.log("============Length====================");
        return bPromise.map(addy.models, function(addy) {

            var product_price = addy.get("product_price");
            var customer_id = addy.get("customer_id");
            var product_quantity = addy.get("product_quantity");
            //var sum+= product_p_a;
            var final_price = (product_price * product_quantity);
            var code = addy.get("code");
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
    var user2 = BookProducts.forge().query(function(qb) {

        qb.select('*');
        qb.where('customer_id', '=', customer_id);
        qb.andWhere({
            'code': code
        })

    }).fetchAll().then(function(addy) {
        return addy;
    }).then(function(addy) {

        return bPromise.map(addy.models, function(addy) {

            var product_price = addy.get("product_price");
            var customer_id = addy.get("customer_id");
            var product_quantity = addy.get("product_quantity");
            return {

                product_name: addy.get("product_name"),
                product_price: addy.get("product_price"),
                product_quantity: addy.get("product_quantity"),

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
                    result: user2
                });
            }
        })
        .catch(function(err) {
            return errors.returnError(err, res);
        });

}








exports.book_products = function(req, res) {

    var code = randomValueHex(7);
    var f_data = [];

    var technology = (req.body.technology) ? req.body.technology : false;
    if (technology == 'ios') {
        if (Object.prototype.toString.call(req.body.productData2[0].product_name) === '[object Array]') {



            var delivery_type = (req.body.delivery_type) ? req.body.delivery_type : false;
            //delivery_type
            //cconsole.log("============================outside 1");
            console.log("Address is =" + address);
            console.log("landmark is =" + landmark);
            console.log("city is =" + city);
            console.log("state is =" + state);
            console.log("pincode is =" + pincode);
            console.log("customer_id is =" + customer_id);
            console.log("============================outside 1");


            if (delivery_type = 'HomeDelivery') {
                var address = (req.body.address) ? req.body.address : false;
                var landmark = (req.body.landmark) ? req.body.landmark : false;
                var city = (req.body.city) ? req.body.city : false;
                var state = (req.body.state) ? req.body.state : false;
                var pincode = (req.body.pincode) ? req.body.pincode : false;
                var customer_id = (req.body.customer_id) ? req.body.customer_id : false;
                //var country = (req.body.country)?req.body.country:false;

                console.log("============================inside 1");
                console.log("Address is =" + address);
                console.log("landmark is =" + landmark);
                console.log("city is =" + city);
                console.log("state is =" + state);
                console.log("pincode is =" + pincode);
                console.log("customer_id is =" + customer_id);
                console.log("============================inside 1");

                var AddressData = new Address({
                    "address": address,
                    "landmark": landmark,
                    "city": city,
                    "state": state,
                    "pincode": pincode,
                    //"country":country,
                    //"order_id":code,    
                    "customer_id": customer_id,

                });

                AddressData.save(null).tap(function(model) {
                    AddressData = model;
                }).then(function(AddressData) {

                }).catch(function(err) {
                    console.log("error 2");
                    return err;
                });

            }

            for (var k = 0; k < req.body.productData2[0].product_name.length; k++) {
                d = {
                    //"product_weight":req.body.productData2[0].shop_name[k],
                    "product_name": req.body.productData2[0].product_name[k],
                    "product_id": req.body.productData2[0].product_id[k],
                    "product_price": req.body.productData2[0].product_price[k],
                    "shop_name": req.body.productData2[0].shop_name[k],
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
                var product_price = p_data[i].product_price;
                var shop_name = p_data[i].shop_name;
                var product_quantity = p_data[i].product_quantity;
                var product_id = p_data[i].product_id;
                var customer_id = p_data[i].customer_id;
                console.log("=======IOS==============");
                //console.log("product_weight is ="+product_weight);
                console.log("product_name is =" + product_name);
                console.log("product_price is =" + product_price);
                console.log("shop_name is =" + shop_name);
                console.log("product_name is =" + product_quantity);
                console.log("product_name is =" + product_id);
                console.log("product id is =" + customer_id);
                console.log("=======IOS==============");
                var BookData = new BookProducts({
                    "product_name": product_name,
                    "product_price": product_price,
                    "shop_name": shop_name,
                    "product_quantity": product_quantity,
                    "customer_id": customer_id,
                    "product_id": product_id,
                    //"task_type":task_type,
                    "code": code,
                });
                BookData.save(null).tap(function(model) {
                    BookData = model;
                    //	console.log("The product data is "+ProductsData);

                }).then(function(BookData) {
                    res.json({
                        "StatusCode": 200,
                        "Products_": Products,
                        "ResponseMessage": "successfully added !!"
                    });
                }).catch(function(err) {

                });
            }
            console.log("==========IOS code end=============");

        } else if (req.body.productData2[0].product_name != '') {

            var delivery_type = (req.body.delivery_type) ? req.body.delivery_type : false;

            console.log("============================outside 2");
            console.log("Address is =" + address);
            console.log("landmark is =" + landmark);
            console.log("city is =" + city);
            console.log("state is =" + state);
            console.log("pincode is =" + pincode);
            console.log("customer_id is =" + customer_id);
            console.log("============================outside 2");


            if (delivery_type = 'HomeDelivery') {
                var address = (req.body.address) ? req.body.address : false;
                var landmark = (req.body.landmark) ? req.body.landmark : false;
                var city = (req.body.city) ? req.body.city : false;
                var state = (req.body.state) ? req.body.state : false;
                var pincode = (req.body.pincode) ? req.body.pincode : false;
                var customer_id = (req.body.customer_id) ? req.body.customer_id : false;
                //var country = (req.body.country)?req.body.country:false;

                console.log("============================inside 2");
                console.log("Address is =" + address);
                console.log("landmark is =" + landmark);
                console.log("city is =" + city);
                console.log("state is =" + state);
                console.log("pincode is =" + pincode);
                console.log("customer_id is =" + customer_id);
                console.log("============================inside 2");

                var AddressData = new Address({
                    "address": address,
                    "landmark": landmark,
                    "city": city,
                    "state": state,
                    "pincode": pincode,
                    //"country":country,
                    //"order_id":code,    
                    "customer_id": customer_id,

                });

                AddressData.save(null).tap(function(model) {
                    AddressData = model;
                }).then(function(AddressData) {

                }).catch(function(err) {
                    console.log("error 2");
                    return err;
                });

            }


            var product_name = req.body.productData2[0].product_name;
            var product_price = req.body.productData2[0].product_price;
            var shop_name = req.body.productData2[0].shop_name;
            var product_quantity = req.body.productData2[0].product_quantity;
            var product_id = req.body.productData2[0].product_id;
            var customer_id = req.body.productData2[0].customer_id;

            var BookData = new BookProducts({
                "product_name": product_name,
                "product_price": product_price,
                "shop_name": shop_name,
                "product_quantity": product_quantity,
                "customer_id": customer_id,
                "product_id": product_id,
                //"task_type":task_type,
                "code": code,
            });
            BookData.save(null).tap(function(model) {
                BookData = model;
                //	console.log("The product data is "+ProductsData);

            }).then(function(BookData) {
                res.json({
                    "StatusCode": 200,
                    "Products_": Products,
                    "ResponseMessage": "successfully added !!"
                });
            }).catch(function(err) {

            });


        }

    } //ios bracket close
    else {

        console.log("==========Android code start=============");
        var pro = req.body;
        var pro2 = pro.productData2;
        //var customer_id=77;	
        var p_data = JSON.parse(pro2);

        //var p_data = pro2;
        var code = randomValueHex(7)
        var delivery_type = (req.body.delivery_type) ? req.body.delivery_type : false;
        if (delivery_type = 'HomeDelivery') {
            var address = (req.body.address) ? req.body.address : false;
            var landmark = (req.body.landmark) ? req.body.landmark : false;
            var city = (req.body.city) ? req.body.city : false;
            var state = (req.body.state) ? req.body.state : false;
            var pincode = (req.body.pincode) ? req.body.pincode : false;
            var customer_id = (req.body.customer_id) ? req.body.customer_id : false;

            var AddressData = new Address({
                "address": address,
                "landmark": landmark,
                "city": city,
                "state": state,
                "pincode": pincode,
                "customer_id": customer_id,

            });

            AddressData.save(null).tap(function(model) {
                AddressData = model;
            }).then(function(AddressData) {

            }).catch(function(err) {
                console.log("error 2");
                return err;
            });

        }
        console.log("==========p_data start====================");
        console.log(p_data);
        console.log("==========p_data end======================");
        //var p_data = pro2;
        //var p_data = JSON.parse(pro2);
        bPromise.each(p_data, function(elements) {
            console.log("Promise loop ");
            console.log("The elements are " + elements);

        }).then(function(pro2) {
            console.dir(pro2);
            for (var i = 0; i < pro2.length; i++) {
                var product_name = pro2[i].product_name;
                var product_id = pro2[i].product_id;
                var product_price = pro2[i].product_price;
                //var product_weight = pro2[i].product_weight;
                var customer_id = pro2[i].customer_id;
                var shop_name = pro2[i].shop_name;
                //var delivery_type = pro2[i].delivery_type;
                var product_quantity = pro2[i].product_quantity;

                console.log("=====Complete Pro detail Start======");
                console.log("pro product_name =" + product_name);
                console.log("pro product_id =" + product_id);
                //console.log("pro product_weight ="+product_weight);
                console.log("pro product_price =" + product_price);
                console.log("pro customer_id =" + customer_id);
                console.log("pro quanitity =" + product_quantity);
                console.log("=====Complete Pro detail end======");
                console.log("booking id on server page" + customer_id);


                var BookData = new BookProducts({
                    "product_id": product_id,
                    "product_name": product_name,
                    "product_price": product_price,
                    "product_weight": 1,
                    "product_quantity": product_quantity,
                    "customer_id": customer_id,
                    "shop_name": shop_name,
                    "delivery_type": delivery_type,
                    "code": code,
                });
                BookData.save(null).tap(function(model) {
                    BookData = model;
                    console.log("The product data is " + BookData);

                }).then(function(BookData) {
                    console.log("The product data is " + BookData);
                    ///res.json({"StatusCode": 200,"ResponseMessage": "successfully added !!"});
                }).catch(function(err) {
                    //console.log("catch part");
                    console.log("The product data is " + BookData);
                    //res.json({"StatusCode": 200,"ResponseMessage": "successfully added !!"});

                });
            }
        });
        //finalResult(req, res,customer_id,code);




    }

    finalResult(req, res, customer_id, code);

}




function finalResult(req, res, customer_id, code) {

    console.log("customer id is=" + customer_id);
    var ChkData = new chk({
        "code": code,
        "customer_id": customer_id
    });

    ChkData.save(null).tap(function(model) {
        ChkData = model;
    }).then(function(ChkData) {
        res.json({
            "StatusCode": 200,
            "ResponseMessage": "successfully added !!"
        });

    }).catch(function(err) {
        console.log("error 2");

        return err;
    });
}

exports.final_checkout = function(req, res) {
    var user1 = [];
    var customer_id = (req.query.customer_id) ? req.query.customer_id : false;
    var task_type = (req.query.task_type) ? req.query.task_type : false;
    var status = 4;
    params = status;

    params = {
        "status": status
    }
    var updateParams = {
        patch: true
    }
    var data = params;
    return Products.forge().query(function(qb) {
        qb.where('customer_id', customer_id);
        //qb.andWhere({'status':  3});  
        qb.andWhere({
            'task_type': task_type
        });
    }).fetchAll().then(function(products) {
        products.forEach(function(Products) {
            return Products.save(data, updateParams);
        });
        res.json({
            "StatusCode": 200,
            "ResponseMessage": "successfully added !!"
        });
    }).catch(function(err) {
        console.log(err);
        return err;
    });


}



exports.payment_gate_way = function(req, res) {

    console.log("The loop is working ");
    var PaymentAmount = (req.body.PaymentAmount) ? req.body.PaymentAmount : false;
    var Status = (req.body.Status) ? req.body.Status : false;
    var PaymentId = (req.body.PaymentId) ? req.body.PaymentId : false;
    var CustomerId = (req.body.CustomerId) ? req.body.CustomerId : false;
    var date = (req.body.date) ? req.body.date : false;

    console.log("date is " + date);

    var Gate_wayData = new Gate_way({
        "PaymentAmount": PaymentAmount,
        "Status": Status,
        "PaymentId": PaymentId,
        //"product_weight":product_weight,
        "CustomerId": CustomerId,
        "date": date
    });
    Gate_wayData.save(null).tap(function(model) {
        Gate_wayData = model;
        //	console.log("The product data is "+ProductsData);

    }).then(function(Gate_wayData) {
        res.json({
            "StatusCode": 200,
            "ResponseMessage": "successfully added !!"
        });
    }).catch(function(err) {

    });

}

/*exports.book_products = function(req, res){

	console.log("==========Book products=============");
	var f_data =[];
	console.log("==========Panditji code start==========");
	var technology = (req.body.technology)?req.body.technology:false;

	if(technology =='ios')
	{
		if (Object.prototype.toString.call(req.body.productData2[0].product_weight) === '[object Array]'){

			for(var k=0;k<req.body.productData2[0].product_name.length;k++){
				d={
					//"product_weight":req.body.productData2[0].product_weight[k],
					"product_price":req.body.productData2[0].product_price[k],
					"product_name":req.body.productData2[0].product_name[k],
					"product_id":req.body.productData2[0].product_id[k],
					"product_quantity":req.body.productData2[0].product_quantity[k],
					"customer_id":req.body.productData2[0].customer_id[k],
					"shop_name":req.body.productData2[0].shop_name[k]
				}
				console.log("the value of d is "+d);
				f_data.push(d);
			}
			req.body.productData2 = f_data;
			console.log("The value of prodata 2 is "+req.body.productData2);


			var pro=req.body.productData2;
			var p_data = pro;
			console.log("The pro is "+p_data);



			for ( var i in p_data) {

				console.log(i);
				var product_name = p_data[i].product_name;
				var product_id = p_data[i].product_id;
				var product_price = p_data[i].product_price;
				//var product_weight = p_data[i].product_weight;
				var product_quantity = p_data[i].product_quantity;
				var customer_id = p_data[i].customer_id;
				var shop_name = p_data[i].shop_name;
				console.log("product_weight is"+product_weight);
				console.log("product_name is"+product_name);
				var BookData = new BookProducts({
					"product_name":product_name,
					"product_id":product_id,
					//"product_weight":product_weight,
					"product_quantity":product_quantity,
					"product_price":product_price,
					"shop_name":shop_name,
					"customer_id":customer_id,
				});
				BookData.save(null).tap(function (model){

					BookData = model;

				}).then(function(BookData){
					res.json({"StatusCode": 200,"Products_": Products,"ResponseMessage": "successfully added !!"});
					}).catch(function(err){

				});	
			}

			console.log("======Panditji code end=======");
		}

		else if(req.body.productData2[0].product_name !=''){

			console.log("The loop is working ");
			var product_name = req.body.productData2[0].product_name;
			var product_id = req.body.productData2[0].product_id;
			var product_price = req.body.productData2[0].product_price;
			//var product_weight = req.body.productData2[0].product_weight;
			var product_quantity = req.body.productData2[0].product_quantity;
			var customer_id = req.body.productData2[0].customer_id;
			var shop_name = req.body.productData2[0].shop_name;

			console.log("Product name "+product_name);
			console.log("product name with K is "+req.body.productData2[0].product_weight[0])

			var BookData = new BookProducts({
				"product_id":product_id,
				"product_name":product_name,
				"product_price":product_price,
				//"product_weight":product_weight,
				"product_quantity":product_quantity,
				"customer_id":customer_id,
				"shop_name":shop_name,
			});
			BookData.save(null).tap(function (model){
				BookData = model;
			//	console.log("The product data is "+ProductsData);

			}).then(function(BookData){
				res.json({"StatusCode": 200,"Products_": Products,"ResponseMessage": "successfully added !!"});
			}).catch(function(err){

			});	

		}

	}
	else
	{
		console.log("==========Arun code start=============");
		var pro=req.body;
		var pro2 = pro.productData2;	
		//var code = randomValueHex(7)  

		console.log("The pro 2 is ="+ pro.productData2);
		console.log("And now pro 2 will be ="+ pro2);
		console.log("pro2pro2pro2pro2pro2");
		console.log(pro2);
		var p_data = JSON.parse(pro2);

		console.log("==========p_data start====================");
		console.log(p_data);
		console.log("==========p_data end======================");

		bPromise.each(p_data, function(elements) {
			console.log("Promise loop ");
			console.log("The elements are "+elements);	

		}).then(function(pro2) {
			console.dir(pro2);
			for ( var i=0 ;i<pro2.length ;i++) {
				var product_name = pro2[i].product_name;
				var product_id = pro2[i].product_id;
				var product_price = pro2[i].product_price;
				//var product_weight = pro2[i].product_weight;
				var customer_id = pro2[i].customer_id;
				var shop_name = pro2[i].shop_name;
				var product_quantity = pro2[i].product_quantity;

				console.log("=====Complete Pro detail Start======");
				console.log("pro product_name ="+product_name);
				console.log("pro product_id ="+product_id);
				//console.log("pro product_weight ="+product_weight);
				console.log("pro product_price ="+product_price);
				console.log("pro customer_id ="+customer_id);
				console.log("pro quanitity ="+product_quantity);
				console.log("=====Complete Pro detail end======");

				var BookData = new BookProducts({
					"product_id":product_id,
					"product_name":product_name,
					"product_price":product_price,
					"product_weight":1,
					"product_quantity":product_quantity,
					"customer_id":customer_id,
					"shop_name":shop_name,
				});
				BookData.save(null).tap(function (model){
					BookData = model;
					console.log("The product data is "+BookData);

				}).then(function(BookData){
					res.json({"StatusCode": 200,"Products_": Products,"ResponseMessage": "successfully added !!"});
				}).catch(function(err){

				});	
			}
		});
	}
};*/