var orm = require('../orm');

// Related Models

var chk = orm.bookshelf.Model.extend({
	  tableName: 'tbl_chk',
	  idAttribute: 'id',
});
 	
module.exports = chk;


