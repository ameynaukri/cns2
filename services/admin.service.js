var Products = require('../models/admin.model'),
    moment = require('moment'),
    moment_tz = require('moment-timezone'),
    bPromise = require("bluebird"),
    helperServices = require('../services/helper.service');



exports.deleteProduct = function(params, price_details, product_id, shop_id) {
    var shop_name = (params.shop_name) ? params.shop_name : false;
    var admin_id = (params.admin_id) ? params.admin_id : false;

    function remove(array, to_remove) {

        var elements = string.split(",");
        var remove_index = elements.indexOf(to_remove);
        elements.splice(remove_index, 1);
        var result = elements.join(",");
        return result;

    }


    var string = shop_id;
    console.log("the original string is" + string);

    var newstring = remove(string, admin_id);
    console.log("the new string is" + newstring);

    console.log("Now the id is remove and the result is " + newstring);
    var destArr = [];
    var srcArr = JSON.parse(price_details);
    console.log("The admin id is " + shop_id);
    for (i in srcArr) {
        if (srcArr[i].shop_name != shop_name)
            destArr[i] = srcArr[i];
    }
    srcArr = destArr;
    console.log("Delete that" + srcArr);
    var j_son = JSON.stringify(srcArr);
    var j_son_2 = j_son.replace('null,', '');
    console.log("Price details are ========" + j_son_2);
    console.log("shop_name are ========" + newstring);
    params = {
        "price_details": j_son_2,
        "shop_name": newstring,
    }
    var updateParams = {
        patch: true
    }
    var data = params;

    return Products.forge().query(function(qb) {
        qb.where('product_id', product_id);

    }).fetch().then(function(products) {
        return products.save(data, updateParams);
    }).catch(function(err) {
        console.log(err);
        return err;
    });

}


exports.editProduct = function(params, price_details, product_id) {
    console.log("edit product service page ");
    var product_id = product_id;
    var shop_name = (params.shop_name) ? params.shop_name : false;
    var product_price = (params.product_price) ? params.product_price : false;
    var jsonObj = JSON.parse(price_details);
    console.log("The old json is " + jsonObj);

    for (var i = 0; i < jsonObj.length; i++) {
        console.log("json shop name" + jsonObj[i].shop_name);
        console.log("shop name" + shop_name);
        if (jsonObj[i].shop_name == shop_name) {
            jsonObj[i].price = product_price;
            console.log("=============================");
            console.log("Edit json is " + jsonObj);

            var j_son = JSON.stringify(jsonObj);
            //console.log(jsonObj);
            console.log(j_son);
            //var ddd=5;
            console.log("=============================");
            params = {
                "price_details": j_son,
            }
            //console.log("the params are "+j_son);
            //break;

        }
    }
    //[{"shop_name":"Raverkar Store","price":690},{"shop_name":"Jitendra Store","price":80},{"shop_name":"Apun ka dhaba","price":11}]


    //console.log("now the final insert JSON is"+parse_data);
    /*params = {
      "price_details":ddd,
    }*/
    var updateParams = {
        patch: true
    }
    var data = params;

    return Products.forge().query(function(qb) {
        qb.where('product_id', product_id);

    }).fetch().then(function(products) {
        return products.save(data, updateParams);
    }).catch(function(err) {
        console.log(err);
        return err;
    });

    //break;




};

//var jsonObj =price_details
/*var jsonObj = [{'Id':'1','Username':'Ray','FatherName':'Thompson'},  
               {'Id':'2','Username':'Steve','FatherName':'Johnson'},
               {'Id':'3','Username':'Albert','FatherName':'Einstein'}]

for (var i=0; i<jsonObj.length; i++) {
  if (jsonObj[i].Username == 'Albert') {
    jsonObj[i].FatherName = "Amey Raverkar";
    console.log(jsonObj);
    break;
  }
}*/

exports.add = function(params) {

    console.log("Addddd page===================");
    var shop_name = (params.shop_name) ? params.shop_name : false;
    var product_price = (params.product_price) ? params.product_price : false;
    var price_details = '[{"shop_name"' + ':' + '"' + shop_name + '","price"' + ':' + product_price + '}]';
    var ProductsData = new Products({
        "product_name": (params.product_name) ? params.product_name : false,
        //"product_quantity":(params.product_quantity)?params.product_quantity:false,
        "product_price": (params.product_price) ? params.product_price : false,
        "shop_name": (params.admin_id) ? params.admin_id : false,
        "task_type": (params.task_type) ? params.task_type : false,
        //"admin_id":(params.admin_id)?params.admin_id:false,
        "price_details": price_details,

    });

    console.log("Shop name is " + shop_name);
    console.log("product_price is " + product_price);
    console.log("price_details is " + price_details);
    //console.log("Shop name is "+shop_name);

    return ProductsData.save(null).tap(function(model) {
        ProductsData = model;
        return ProductsData;
    }).then(function(ProductsData) {
        return ProductsData;
    }).catch(function(err) {
        return err;
    });
};

exports.add1 = function(params, price_details, product_id, shop_id) {

    console.log("One ++++++Addddd page===================");

    var product_name = (params.product_name) ? params.product_name : false;
    var admin_id = (params.admin_id) ? params.admin_id : false;
    var product_id = product_id;
    //var shop_id=shop_id;
    var edit_shop = shop_id + ',' + admin_id;
    var shop_name = (params.shop_name) ? params.shop_name : false;
    var product_price = (params.product_price) ? params.product_price : false;
    var price_details_edit = ',{"shop_name"' + ':' + '"' + shop_name + '","price"' + ':' + product_price + '}';

    console.log("service page  " + price_details);
    console.log("price details is 2 time" + price_details);
    var price_details1 = price_details.replace('[', '');
    var price_details2 = price_details1.replace(']', '');
    console.log("price details is 2 time" + price_details2);
    var price_is = '[' + price_details2 + price_details_edit + ']';
    console.log("Join is " + price_is);
    console.log("product_id is =" + product_id);


    console.log("Final Shop name is " + edit_shop);
    console.log("Product name is " + product_name);
    console.log("update price of product name" + price_is);

    params = {
        "price_details": price_is,
        "shop_name": edit_shop
    }
    var updateParams = {
        patch: true
    }

    var data = params;

    return Products.forge().query(function(qb) {
        qb.where('product_id', product_id);

    }).fetch().then(function(products) {
        return products.save(data, updateParams);
    }).catch(function(err) {
        console.log(err);
        return err;
    });

};