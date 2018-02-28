var orm = require('../orm');

// Related Models

var Users = orm.bookshelf.Model.extend({
	
	  tableName: 'user',
	  idAttribute: 'id',
	  /*completedDealsCount : function(){ 
			return this.hasMany(Deals, 'userId'); 
	}*/
});

module.exports = Users;
//Deals = require('./enquiry.model');
