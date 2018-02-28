var orm = require('../orm');


var Comments = orm.bookshelf.Model.extend({
	  tableName: 'tbl_comments',
	  idAttribute: 'comment_id',
  
});
 
module.exports = Comments;



