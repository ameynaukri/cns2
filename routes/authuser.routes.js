/**
 * Module dependencies
 */
 var controller = require('../controllers/authuser.controller');
 var middleware = require('../middlewares/AuthUser.middleware');
 /**
 * the new Router exposed in express 4
 * the indexRouter handles all requests to the `/` path
 */
module.exports = function(router) {
  /**
   * this accepts all request methods to the `/` path
   */

  
  router.route('/login')
      .post(controller.login);
 /* router.route('/profile_update')
      .post(controller.profile_update); */   
  router.route('/logout')
      .post(controller.logout);

 /* router.route('/authorize/me')
      .get(controller.authorizseUser,controller.userdetail);*/
}
