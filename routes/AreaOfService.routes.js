/**
 * Module dependencies
 */
var controller = require('../controllers/AreaOfService.controller'),
    middleware = require('../middlewares/AuthUser.middleware');
/**
 * the new Router exposed in express 4
 * the indexRouter handles all requests to the `/` path
 */
module.exports = function(router) {
    /**
     * this accepts all request methods to the `/` path
     */
    router.route('/area/get')
        .get(controller.getArea);
    router.route('/area/add')
        .post(controller.add);
    router.route('/area/delete/:AreaId')
        .delete(controller.deleteArea);
    /*router.route('/area/update')
        .post(controller.updateClient);*/
    /*router.route('/client/resetpassword')
        .post(controller.resetPassword);*/

}