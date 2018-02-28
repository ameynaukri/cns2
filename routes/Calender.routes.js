/**
 * Module dependencies
 */
var controller = require('../controllers/Calender.controller'),
    middleware = require('../middlewares/AuthUser.middleware');
/**
 * the new Router exposed in express 4
 * the indexRouter handles all requests to the `/` path
 */
module.exports = function(router) {
    /**
     * this accepts all request methods to the `/` path
     */
    router.route('/calender')
        .get(controller.calender);
    router.route('/calender_detail')
        .post(controller.calender_detail);
    router.route('/calender_ingredients_detail')
        .get(controller.calender_ingredients_detail);



}

//http://192.168.1.55:3010/user/accept_product:id
//http://192.168.1.55:3010/user/client/:clientId/:orgId