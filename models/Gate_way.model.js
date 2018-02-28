var orm = require('../orm');

// Related Models

var Book = orm.bookshelf.Model.extend({
	  tableName: 'tbl_payment_gate_way',
	  idAttribute: 'id',
});
 	
module.exports = Book;


