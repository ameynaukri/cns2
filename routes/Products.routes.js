/**
 * Module dependencies
 */
 var controller = require('../controllers/Products.controller'),
	   middleware = require('../middlewares/AuthUser.middleware');
 /**
 * the new Router exposed in express 4
 * the indexRouter handles all requests to the `/` path
 */
module.exports = function(router) {
  /**
   * this accepts all request methods to the `/` path
   */
  /*router.route('/add_body') 
      .post(controller.add_body);
  router.route('/add_food')
      .post(controller.add_food);    
  router.route('/add_cleaning')
      .post(controller.add_cleaning);
  router.route('/add_events')
      .post(controller.add_events);    
  router.route('/add_sports')
      .post(controller.add_sports);  */       
  router.route('/search_my_product')
      .post(controller.search_my_product);
  router.route('/add_customer_product_list')
      .get(controller.add_customer_product_list); 
  router.route('/add_product_in_shopping_list')
      .get(controller.add_product_in_shopping_list);       
 /* router.route('/user/client/:Id')
      .get(controller.listClient);  */
  router.route('/area/get_admin_product')
      .get(controller.getArea); 
  router.route('/user/Product')
      .get(controller.listClient1); 

  router.route('/user/listClient2')
      .get(controller.listClient2); 
  router.route('/user/offer_1')
      .get(controller.offer_1); 
  router.route('/user/offer_2')
      .get(controller.offer_2);
  router.route('/user/get_customer_detail')
      .get(controller.get_customer_detail); 
  router.route('/user/get_customer_product_detail')
      .get(controller.get_customer_product_detail);  
  router.route('/user/get_list_customer_accept_offer')
      .get(controller.get_list_customer_accept_offer);        
  router.route('/user/get_customer_accept_detail')
      .get(controller.get_customer_accept_detail);      
  router.route('/user/accept_product')
      .delete(controller.accept_product);  
  router.route('/user/decline_product')
      .delete(controller.decline_product);         
      /*router.route('/Shop/getShop')
	  .post(controller.getShop);
  router.route('/Shop/apply')
  	  .post(controller.apply);*/
  router.route('/Products')
      .get(controller.getAllProducts);
  router.route('/get_product_by_lat_lng')
      .post(controller.get_product_by_lat_lng); 
  router.route('/get_shop_by_lat_lng')
      .post(controller.get_shop_by_lat_lng);        


}

//http://192.168.1.55:3010/user/accept_product:id
//http://192.168.1.55:3010/user/client/:clientId/:orgId