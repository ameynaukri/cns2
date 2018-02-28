var orm = require('../orm');

// Related Models

var Customer = orm.bookshelf.Model.extend({
	  tableName: 'tbl_customer_login',
	  idAttribute: 'customer_id'
});
module.exports = Customer; 
