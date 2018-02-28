/**
 * Module dependencies
 */
 var controller = require('../controllers/Deals.controller'),
	   middleware = require('../middlewares/AuthUser.middleware');
 /**
 * the new Router exposed in express 4
 * the indexRouter handles all requests to the `/` path
 */
module.exports = function(router) {
  /**
   * this accepts all request methods to the `/` path
   */
  router.route('/enquiryList')
      .get(controller.getEnquiryList);
  router.route('/sendmail')
  		.post(controller.sendmail);
  router.route('/deal/detail')
        .get(controller.getDealDetail);
  router.route('/deal/update')
  		.post(controller.updateDealDetail);
  router.route('/getDeals')
  		.get(controller.getDeal);
  router.route('/credit/cashback')
  		.post(controller.creditCashback)
}