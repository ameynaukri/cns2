var orm = require('../orm');

// Related Models

var User = orm.bookshelf.Model.extend({
  tableName: 'Customer_name',
  idAttribute: 'Id',
 /* payment : function(){
  	return this.hasMany(payment, 'UserId');
  }*/
});


module.exports = User;

// Load child models after exports, so that can create 2-way relations
//payment = require('./payment.model');