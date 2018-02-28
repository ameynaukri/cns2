var config = require('../config'),
    Forums = require('../models/Forums.model'),
    Comments = require('../models/Comments.model'),
    user = require('../models/user.model'),
    ForumsServices = require('../services/Forums.service'),
    helperServices = require('../services/helper.service'),
    moment = require('moment'),
    moment_tz = require('moment-timezone'),
    bPromise = require("bluebird");


exports.addForums = function(req, res) {
    console.log("add addForums");
    return ForumsServices.addForums(req.body).then(function(Forums) {
        if (Forums) {
            res.json({
                "StatusCode": 200,
                "Area_": Forums,
                "ResponseMessage": "successfully added !!"
            });
        } else {
            res.json({
                "StatusCode": 301,
                "Message": "An error has occurred."
            });
        }
    }).catch(function(err) {
        res.json({
            "StatusCode": err.status,
            "Area_": [],
            "ResponseMessage": err.messages
        });
    });
}

exports.getAllForums = function(req, res) {


    var category = (req.query.task_type) ? req.query.task_type : false;
    var area = user.forge().query(function(qb) {
        //	var user = User.forge().query(function (qb) {

        qb.select('user.first_name', 'tbl_forum.title', 'tbl_forum.id');
        qb.rightJoin('tbl_forum', function() {
            this.on('tbl_forum.id', '=', 'user.id')
        })
        /*qb.count('tbl_comments.comment_id as  no_of_comments');
        qb.leftJoin('tbl_comments', function() {
        	this.on('tbl_comments.id', '=', 'user.id')
        })*/
        qb.count('tbl_forum.id as  no_of_comments');
        qb.orderBy('forum_id', 'desc')
        qb.where('tbl_forum.category', '=', category);
        qb.groupBy("tbl_forum.id");

    }).fetchAll().then(function(addy) {

        return addy;

    }).then(function(addy) {
        return bPromise.map(addy.models, function(addy) {

            return {
                first_name: addy.get("first_name"),
                customer_id: addy.get("id"),
                title: addy.get("title"),
                no_of_comments: addy.get("no_of_comments"),
                time: "10:30",

            }
        })
    });

    area.then(function(area) {
            if (area.length == 0) {
                var area = [];
                res.json({
                    "error": false,
                    status: "success but records are not present",
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

exports.getForumsDetail = function(req, res) {


    var customer_id = (req.query.customer_id) ? req.query.customer_id : false;
    var category = (req.query.task_type) ? req.query.task_type : false;
    /*var area = user.forge().query(function (qb) {
    	qb.select('user.first_name','tbl_forum.title','tbl_forum.id','tbl_forum.story');
    	qb.leftJoin('tbl_forum', function() {
    		this.on('tbl_forum.id', '=', 'user.id')
    	})
    	qb.where('tbl_forum.id', '=', customer_id);
    	qb.andWhere({'tbl_forum.category':  category})
    	

    }).fetchAll().then(function(addy) {*/
    var area = Forums.forge().query(function(qb) {
        qb.select('*');
        /*qb.leftJoin('tbl_forum', function() {
        	this.on('tbl_forum.id', '=', 'user.id')
        })*/
        qb.where('id', '=', customer_id);
        qb.andWhere({
            'category': category
        })
        qb.orderBy('forum_id', 'desc')


    }).fetchAll().then(function(addy) {

        return addy;

    }).then(function(addy) {
        return bPromise.map(addy.models, function(addy) {

            return {
                first_name: addy.get("first_name"),
                customer_id: addy.get("id"),
                title: addy.get("title"),
                story: addy.get("story"),
                //no_of_comments: addy.get("no_of_comments"),
                time: "10:30",

            }
        })
    });

    area.then(function(area) {
            if (area.length == 0) {
                var area = [];
                res.json({
                    "error": false,
                    status: "success but records are not present",
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