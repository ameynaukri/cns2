var config = require('../config'),
    Products = require('../models/Products.model'),
    //BookProducts = require('../models/Booking.model'),
    Recipes = require('../models/Recipes.model'),
    Products_list = require('../models/Products_list.model'),
    ProductsServices = require('../services/Review.service'),
    helperServices = require('../services/helper.service'),
    moment = require('moment'),
    moment_tz = require('moment-timezone');
var bPromise = require('bluebird');
var DateDiff = require('date-diff');
var crypto = require('crypto');

var orm = require('../orm');



var errorTypes = require('../errortypes');
var crypto = require('crypto');
console.log("hello");



/*exports.getreview = function(req, res){

  var area;
  var area1;
    return ProductsServices.getreview().then(function(result){  
    res.json({"StatusCode": 200,"result": result,"ResponseMessage ":"Hello "+result.get('product_name')+" your records are update  successfully"});
    
    

  }).catch(function(err){
    console.log(err);
    res.json({"StatusCode":err.status,"result":[],"ResponseMessage":err.messages});
  });
  

};*/


exports.get_all_review_1 = function(req, res) {
    var task_type = (req.query.task_type) ? req.query.task_type : false;
    var park = Recipes.forge().query(function(qb) {
        qb.select('*');
        //qb.whereBetween('recipe_id', [671,693]);
        //qb.where('recipe_id', '=', 673);
        qb.where('task_type', '=', task_type);
        //qb.andWhere('task_type', task_type);
        //qb.andWhere({'recipe_id','!=',  674})
        //qb.where('recipe_id', '=', 673);
        //qb.limit(6);673
        //qb.where('tbl_recipe.parking_id', '=', 1);
    }).fetchAll().then(function(addy) {
        return addy;
    }).then(function(addy) {

        return bPromise.map(addy.models, function(addy) {

            return {
                recipe_id: addy.get("recipe_code"),
                product_title: addy.get("product_title"),
                product_description: addy.get("product_description"),
                date: addy.get("date"),
            }

        })
    });
    park.then(function(park) {
            if (park.length == 0) {

                var park = [];
                res.json({
                    "error": false,
                    status: "success",
                    "message": "No records are found"
                });
            } else {

                if (task_type == 'Food') {
                    res.json({
                        "error": false,
                        status: "success",
                        task_type: 1,
                        "message": "These are the records",
                        result: park
                    });

                }
                if (task_type == 'Cleaning') {
                    res.json({
                        "error": false,
                        status: "success",
                        task_type: 2,
                        "message": "These are the records",
                        result: park
                    });
                }
                if (task_type == 'Sports') {
                    res.json({
                        "error": false,
                        status: "success",
                        task_type: 3,
                        "message": "These are the records",
                        result: park
                    });
                }
                if (task_type == 'Events') {
                    res.json({
                        "error": false,
                        status: "success",
                        task_type: 4,
                        "message": "These are the records",
                        result: park
                    });
                }
                if (task_type == 'Body') {
                    res.json({
                        "error": false,
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


exports.get_all_review_2 = function(req, res) {

    var recipe_id = (req.query.recipe_id) ? req.query.recipe_id : false;
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
                    status: "success",
                    "message": "These are the records",
                    result: ingredients
                });

            }
        })
        .catch(function(err) {
            return errors.returnError(err, res);
        });
};
/*Back_up start*/

/*exports.get_all_review = function(req, res){
        
        var park = Recipes.forge().query(function (qb) {
        qb.select('*');
        qb.limit(6);
        //qb.where('tbl_recipe.parking_id', '=', 1);
    }).fetchAll().then(function(addy) {
        return addy;
    }).then(function(addy){
        
           return bPromise.map(addy.models, function(addy){

            var re =addy.get("recipe_code");
            var product_title =addy.get("product_title");
              //if(product_title !=''){
              var row = '{"product_title":"'+product_title+'","product_description":"'+product_title+'"';
             // }
              
                row +=',';  
                row +='"Item" : [{';

                row +='"product_name":"'+addy.get("product_name")+'"';
                row += ',';
                row +='"product_quantity":"'+addy.get("product_name")+'"';
                row += ',';
                row +='"product_weight":"'+addy.get("product_name")+'"';
                row += "}]}";
              
             
              //row += "}";
              
              console.log(row);

              row = row.replace('one', 'two');
              var f = JSON.parse(row);
              console.log(f)
             return f;
              console.log("Hello");
            
        })
    });
    park.then(function (park) {
        if(park.length == 0){
        
            var park = [];
            res.json({"error":false, status:"success","message":"No records are found", result:park});
        }else{
       
            res.json({"error":false, status:"success","message":"These are the records", result:park});
           
        }
    })
    .catch(function(err) {
        return errors.returnError(err,res);
    });
};*/

/*Back_up end*/
/*exports.get_all_review = function(req, res){
        
        
        var park = Recipes.forge().query(function (qb) {
        qb.select('*');
        qb.limit(6);
        //qb.where('tbl_recipe.parking_id', '=', 1);
    }).fetchAll().then(function(addy) {
        return addy;
    }).then(function(addy){
        
           return bPromise.map(addy.models, function(addy){

            var re =addy.get("recipe_code");
            var product_title =addy.get("product_title");
              
              var row = '{"product_title":"'+product_title+'","product_description":"'+product_title+'"';
            
              if(product_title=='')
              {
                row +=',';  
                row +='"Item" : [{';

                row +='"product_name":"'+addy.get("product_name")+'"';
                row += ',';
                row +='"product_quantity":"'+addy.get("product_name")+'"';
                row += ',';
                row +='"product_weight":"'+addy.get("product_name")+'"';
                row += "}]}";
              }
              else{
             
              row += "}";
              }
              console.log(row);

             row = row.replace('"product_title": "",', '');
              var f = JSON.parse(row);
              console.log(f)
             return f;
              console.log("Hello");
              
            
        })
    });
    park.then(function (park) {
        if(park.length == 0){
        
            var park = [];
            res.json({"error":false, status:"success","message":"No records are found", result:park});
        }else{
       
            res.json({"error":false, status:"success","message":"These are the records", result:park});
           
        }
    })
    .catch(function(err) {
        return errors.returnError(err,res);
    });
};*/
exports.get_between_date_review = function(req, res) {


    // 27-03-2017
    //var date_1 = (req.body.date_1)?req.body.date_1:false;
    var task_type = (req.query.task_type) ? req.query.task_type : false;
    var date_1 = (req.body.date_1) ? req.body.date_1 : false;
    var date_2 = (req.body.date_2) ? req.body.date_2 : false;
    console.log("the date is =" + date_1);
    console.log("the date 2  is =" + date_2);
    console.log("The date 1 is " + moment(date_1).format('YYYY-MM-DD'));
    console.log("The date 2 is " + moment(date_2).format('YYYY-MM-DD'));

    var park = Recipes.forge().query(function(qb) {
        qb.select('*');

        qb.where('date', '>=', moment(date_1).format('YYYY-MM-DD'))
        qb.andWhere('task_type', task_type);
        qb.andWhere('date', '<=', moment(date_2).format('YYYY-MM-DD'));
        //qb.andWhere('tbl_recipe.date', '<=', 29-03-2017)
        /*qb.where('tbl_recipe.date', '<', 27-03-2017)
        qb.andWhere({'tbl_recipe.date':'>',  27-03-2017})*/
        //qb.where('tbl_recipe.parking_id', '=', 1);
    }).fetchAll().then(function(addy) {
        return addy;
    }).then(function(addy) {

        return bPromise.map(addy.models, function(addy) {

            var re = addy.get("recipe_code");
            var product_title = addy.get("product_title");
            var date = addy.get("date");
            var finaldate = moment(finaldate).format('YYYY-MM-DD');

            /*var row = '{"item":"data","shop" : [{';

              row +='"Name":"'+addy.get("product_title")+'"';
              row += ',';
              row +='"Nameq":"'+addy.get("product_title")+'"';
              row += "}]}";
              var f = JSON.parse(row);
        return f;*/
            console.log("Hello");

            return {
                //"result": [{
                "recipe_id": addy.get("recipe_id"),
                "product_title": addy.get("product_title"),
                "product_description": addy.get("product_description"),
                "date": finaldate,
                //  }],


            }


        })
    });
    park.then(function(park) {
            if (park.length == 0) {

                var park = [];
                res.json({
                    "error": false,
                    status: "success",
                    "message": "No records are found",
                    result: park
                });
            } else {

                res.json({
                    "error": false,
                    status: "success",
                    "message": "These are the records",
                    result: park
                });

            }
        })
        .catch(function(err) {
            return errors.returnError(err, res);
        });
};

exports.get_search_review = function(req, res) {


    // 27-03-2017
    var keywords = (req.query.keywords) ? req.query.keywords : false;

    console.log("The date 1 is " + keywords);
    var park = Recipes.forge().query(function(qb) {
        qb.select('*');

        qb.where('tbl_recipe.product_title', 'like', '%' + keywords + '%')
        qb.orWhere('tbl_recipe.product_description', 'like', '%' + keywords + '%');
        //qb.andWhere('tbl_recipe.date', '<=', 29-03-2017)
        /*qb.where('tbl_recipe.date', '<', 27-03-2017)
        qb.andWhere({'tbl_recipe.date':'>',  27-03-2017})*/
        //qb.where('tbl_recipe.parking_id', '=', 1);
    }).fetchAll().then(function(addy) {
        return addy;
    }).then(function(addy) {

        return bPromise.map(addy.models, function(addy) {

            var re = addy.get("recipe_code");
            var product_title = addy.get("product_title");

            /*var row = '{"item":"data","shop" : [{';

              row +='"Name":"'+addy.get("product_title")+'"';
              row += ',';
              row +='"Nameq":"'+addy.get("product_title")+'"';
              row += "}]}";
              var f = JSON.parse(row);
        return f;*/
            console.log("Hello");
            if (product_title != '') {
                return {
                    "Recipe": [{
                        "product_title": addy.get("product_title"),
                        "product_description": addy.get("product_description"),
                    }],


                }
            } else {
                //var park
                /*var park = '"item":"';
                var park += '[';*/
                return {

                    //"In": [{
                    "product_name": addy.get("product_name"),
                    "product_quantity": 5,
                    "product_weight": 5,
                    //}], 


                }
                //var park += ']';



            }

        })
    });
    park.then(function(park) {
            if (park.length == 0) {

                var park = [];
                res.json({
                    "error": false,
                    status: "success",
                    "message": "No records are found",
                    result: park
                });
            } else {

                res.json({
                    "error": false,
                    status: "success",
                    "message": "These are the records",
                    result: park
                });

            }
        })
        .catch(function(err) {
            return errors.returnError(err, res);
        });
};
//exports.getAllProducts = function(){

/*var fetchParams = {withRelated:["productDetail"]};
  return Products.forge().query(function(qb){
    //qb.where("customer_id",id)
  }).fetchAll(fetchParams).then(function(result){
    return result; 
  }).catch(function(err){
    return err;
  });*/
/*var fetchParams = {withRelated:["productDetail"]};
var user = Products.forge().query(function (qb) {
  qb.where('tbl_product_details.recipe_code', '=', 
    'tbl_recipe.recipe_code');
  
    
}).fetchAll(fetchParams).then(function(addy) {
    return addy;
  }).then(function(addy){
      
         
  });
user.then(function (user) {
      if(user.length == 0){
      
          var user = [];
          res.json({"error":false, status:"success","message":"User mobile no is not registered", result:user});
      }else{
     
    res.json({"error":false, status:"success","message":"Message is send mobile no ", result:user});
         
      }
  })
  .catch(function(err) {
      return errors.returnError(err,res);
  });*/
//};