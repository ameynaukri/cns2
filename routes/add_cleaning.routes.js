/**
 * Module dependencies
 */
 var controller = require('../controllers/add_cleaning.controller'),
	   middleware = require('../middlewares/AuthUser.middleware');
 /**
 * the new Router exposed in express 4
 * the indexRouter handles all requests to the `/` path
 */
module.exports = function(router) {
  /**
   * this accepts all request methods to the `/` path
   */
  router.route('/add_cleaning') 
      .post(controller.add_cleaning);
  
  


}

//http://192.168.1.55:3010/user/accept_product:id
//http://192.168.1.55:3010/user/client/:clientId/:orgId