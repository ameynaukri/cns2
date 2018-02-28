/**
 * Module dependencies
 */
 var controller = require('../controllers/Wallet.controller');
 /**
 * the new Router exposed in express 4
 * the indexRouter handles all requests to the `/` path
 */
module.exports = function(router) {
  /**
   * this accepts all request methods to the `/` path
   */

  
  router.route('/get_wallet_detail').get(controller.get_wallet_detail);
 /* router.route('/authorize/me')
      .get(controller.authorizseUser,controller.userdetail);*/
}
