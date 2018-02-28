var orm = require('../orm');

// Related Models

var Products = orm.bookshelf.Model.extend({
	  tableName: 'tbl_list_of_all_products',
	  idAttribute: 'product_id'
});
module.exports = Products; 
