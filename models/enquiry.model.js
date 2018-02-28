var orm = require('../orm');



var Deals = orm.bookshelf.Model.extend({
  tableName: 'Deals',
  idAttribute: 'id',
  UserDetail : function(){ 
  		return this.belongsTo(Users, 'userId'); 
	}
});

module.exports = Deals;
Users = require('./Users.model');