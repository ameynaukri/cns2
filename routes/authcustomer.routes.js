/**
 * Module dependencies
 */
 var controller = require('../controllers/authcustomer.controller');
 var middleware = require('../middlewares/AuthCustomer.middleware');
 /**
 * the new Router exposed in express 4
 * the indexRouter handles all requests to the `/` path
 */
module.exports = function(router) {
  /**
   * this accepts all request methods to the `/` path
   */

  
  router.route('/login/Customer')
      .post(controller.login);
 /* router.route('/profile_update')
      .post(controller.profile_update); */   
  router.route('/logout/Customer')
      .post(controller.logout);

 /* router.route('/authorize/me')
      .get(controller.authorizseUser,controller.userdetail);*/
}
