/**
 * Module dependencies
 */
 var controller = require('../controllers/Customer.controller');
 /**
 * the new Router exposed in express 4
 * the indexRouter handles all requests to the `/` path
 */
module.exports = function(router) {
  /**
   * this accepts all request methods to the `/` path
   */
	router.route('/Customer').post(controller.add);
 /* router.route('/authorize/me')
      .get(controller.authorizseUser,controller.userdetail);*/
}
