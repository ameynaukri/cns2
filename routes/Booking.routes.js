/**
 * Module dependencies
 */
var controller = require('../controllers/Booking.controller'),
    middleware = require('../middlewares/AuthUser.middleware');
/**
 * the new Router exposed in express 4
 * the indexRouter handles all requests to the `/` path
 */
module.exports = function(router) {
    /**
     * this accepts all request methods to the `/` path
     */
    router.route('/book_products')
        .post(controller.book_products);
    router.route('/checkout')
        .get(controller.checkout);
    router.route('/payment_gate_way')
        .post(controller.payment_gate_way);
    router.route('/final_checkout')
        .get(controller.final_checkout);



}

//http://192.168.1.55:3010/user/accept_product:id
//http://192.168.1.55:3010/user/client/:clientId/:orgId