var orm = require('../orm');

// Related Models

var Wallet = orm.bookshelf.Model.extend({
	  tableName: 'tbl_wallet',
	  idAttribute: 'id'
});
module.exports = Wallet; 
