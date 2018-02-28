var orm = require('../orm');

// Related Models

var Book = orm.bookshelf.Model.extend({

  	tableName: 'tbl_booking',
  	idAttribute: 'order_id',
});
 	
module.exports = Book;


