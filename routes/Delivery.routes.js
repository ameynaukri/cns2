/**
 * Module dependencies
 */
 var controller = require('../controllers/Delivery.controller'),
	   middleware = require('../middlewares/AuthUser.middleware');
 /**
 * the new Router exposed in express 4
 * the indexRouter handles all requests to the `/` path
 */
module.exports = function(router) {
  /**
   * this accepts all request methods to the `/` path
   */
  router.route('/Delivery')
      .post(controller.add);
      /*router.route('/Shop/getShop')
	  .post(controller.getShop);
  router.route('/Shop/apply')
  	  .post(controller.apply);*/
  router.route('/Delivery')
      .get(controller.getAllDelivery);
}

