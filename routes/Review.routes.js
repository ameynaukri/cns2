/**
 * Module dependencies
 */
 var controller = require('../controllers/Review.controller'),
     middleware = require('../middlewares/AuthUser.middleware');
 /**
 * the new Router exposed in express 4
 * the indexRouter handles all requests to the `/` path
 */
module.exports = function(router) {
  /**
   * this accepts all request methods to the `/` path
   */
 /* router.route('/client/get')
      .get(controller.getClientList);*/
  
  router.route('/get_all_review_1')
      .get(controller.get_all_review_1);
  router.route('/get_all_review_2')
      .get(controller.get_all_review_2);
  router.route('/get_between_date_review')
      .post(controller.get_between_date_review); 
  router.route('/get_search_review')
      .get(controller.get_search_review); 

          

}