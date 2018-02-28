var config = require('../config'),
    //AreaOfService = require('../services/AreaOfService.service'),
    moment = require('moment'),
    moment_tz = require('moment-timezone'),
    Area = require('../models/AreaOfService.model'),
    AreaOfService = require('../services/AreaOfService.service'),

    Promise = require("bluebird");

var orm = require('../orm');


//var Area = require('../models/AreaOfService.model');	



exports.getArea = function(req, res) {

    var id = (req.query.id) ? req.query.id : false;
    console.log("This is a get area ");
    var area = Area.forge().query(function(qb) {
        //qb.select('area_id','location');
        qb.select('*');
        qb.where('id', '=', id);
        //qb.where('location', 'like', '%'+loc_name+'%');

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

exports.deleteArea = function(req, res) {
    var deleteId = req.params.AreaId;
    return orm.bookshelf.transaction(function(trx) {
        return AreaOfService.deleteArea(deleteId).then(function(formate) {
            return formate;
        }).then(function(formate) {}).catch(function(err) {
            return errors.returnError(err, res);
        });
    }).then(function(invi) {
        //res.json({"success":true,"message":"invoice formate created successfully.","data":invi});
        res.json({
            "error": false,
            "status": "success",
            "message": "Record  deleted successfully.",
            "result": invi
        });
    }).catch(function(err) {
        return errors.returnError(err, res);
    });

}


exports.add = function(req, res) {
    console.log("add Area");
    return AreaOfService.add(req.body).then(function(Area) {
        if (Area) {
            res.json({
                "StatusCode": 200,
                "Area_": Area,
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