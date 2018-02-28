/**
 * Module dependencies
 */
 var controller = require('../controllers/Forums.controller');
 /**
 * the new Router exposed in express 4
 * the indexRouter handles all requests to the `/` path
 */
module.exports = function(router) {
  /**
   * this accepts all request methods to the `/` path
   */
	router.route('/addForums').post(controller.addForums);
	router.route('/getAllForums').get(controller.getAllForums);
	router.route('/getForumsDetail').get(controller.getForumsDetail);
 /* router.route('/authorize/me')
      .get(controller.authorizseUser,controller.userdetail);*/
}
