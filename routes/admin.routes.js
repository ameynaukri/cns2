/**
 * Module dependencies
 */
 var controller = require('../controllers/admin.controller'),
	   middleware = require('../middlewares/AuthUser.middleware');
 /**
 * the new Router exposed in express 4
 * the indexRouter handles all requests to the `/` path
 */
module.exports = function(router) {
  /**
   * this accepts all request methods to the `/` path
   */
  router.route('/admin')
      .post(controller.add);
  router.route('/admin/getadmin_add_product')
      .get(controller.getadmin_add_product); 
  router.route('/admin/editProduct')
      .post(controller.editProduct);    
  /*router.route('/admin/deleteProduct/:ProductId')
      .delete(controller.deleteProduct);*/
  router.route('/admin/deleteProduct')
      .post(controller.deleteProduct);          
 
}


//http://192.168.1.55:3010/user/client/:clientId/:orgId