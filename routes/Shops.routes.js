/**
 * Module dependencies
 */
 var controller = require('../controllers/Shops.controller'),
	   middleware = require('../middlewares/AuthUser.middleware');
 /**
 * the new Router exposed in express 4
 * the indexRouter handles all requests to the `/` path
 */
module.exports = function(router) {
  /**
   * this accepts all request methods to the `/` path
   */
  router.route('/Shops')
      .post(controller.add);
      /*router.route('/Shop/getShop')
	  .post(controller.getShop);
  router.route('/Shop/apply')
  	  .post(controller.apply);
*/  router.route('/Shops')
      .get(controller.getAllShops);
}