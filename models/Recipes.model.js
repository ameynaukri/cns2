var orm = require('../orm');

// Related Models

var Recipe = orm.bookshelf.Model.extend({
	  tableName: 'tbl_recipe',
	  idAttribute: 'recipe_id'
});
module.exports = Recipe; 
