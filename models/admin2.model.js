var orm = require('../orm');

// Related Models

var adminProducts = orm.bookshelf.Model.extend({
	  tableName: 'tbl_admin_product_name',
	  idAttribute: 'id'
});
module.exports = adminProducts; 
