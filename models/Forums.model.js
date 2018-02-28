var orm = require('../orm');


var Forums = orm.bookshelf.Model.extend({
	  tableName: 'tbl_forum',
	  idAttribute: 'tbl_forum',
  
});
 
module.exports = Forums;



