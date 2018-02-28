/**
 * Module dependencies
 */
var express = require('express'),
    controllers = require('../controllers');

/**
 * the new Router exposed in express 4
 * the indexRouter handles all requests to the `/` path
 */
var router = express.Router();

/**
 * this accepts all request methods to the `/` path
 */
router.route('/')
  .all(controllers.index);
require('./authuser.routes')(router);
require('./admin.routes')(router);
require('./Customer.routes')(router);
require('./Products.routes')(router);
require('./AreaOfService.routes')(router);
require('./Booking.routes')(router);
require('./Client.routes')(router);
require('./Review.routes')(router);
require('./Forums.routes')(router)
require('./Calender.routes')(router);
require('./add_food.routes')(router)
require('./add_sports.routes')(router)
require('./add_body.routes')(router)
require('./add_cleaning.routes')(router)
require('./add_events.routes')(router)
require('./Wallet.routes')(router)




exports.router = router;

