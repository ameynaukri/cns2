var orm = require('../orm');

// Related Models

var user = orm.bookshelf.Model.extend({
	  tableName: 'user',
	  idAttribute: 'id'
});
module.exports = user;