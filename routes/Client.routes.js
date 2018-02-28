/**
 * Module dependencies
 */
var controller = require('../controllers/Client.controller'),
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
    router.route('/client/update')
        .post(controller.updateClient);
    router.route('/client/enter_new_password')
        .post(controller.enter_new_password);
    router.route('/client/change_my_password')
        .post(controller.resetpassword_step_one);
    router.route('/client/resetpassword_step_two')
        .post(controller.resetpassword_step_two);
    router.route('/client/resetpassword111')
        .post(controller.resetPassword);
    router.route('/get/clients')
        .get(controller.getClient);
    router.route('/get/resetpassword')
        .post(controller.getClient1);
    router.route('/get/OtpCode')
        .post(controller.getOtpCode);

}