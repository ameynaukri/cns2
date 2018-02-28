/**
 * Module dependencies
 */
 var controller = require('../controllers/venue.controller');
 /**
 * the new Router exposed in express 4
 * the indexRouter handles all requests to the `/` path
 */
module.exports = function(router) {
  /**
   * this accepts all request methods to the `/` path
   */
	router.route('/venue').post(controller.add).get(controller.getVenue);
	router.route('/venue/update').post(controller.update);
	router.route('/api/photo/:file').post(controller.upload);
	router.route('/file/uploads/:file').get(controller.download);
 /* router.route('/authorize/me')
      .get(controller.authorizseUser,controller.userdetail);*/
}
