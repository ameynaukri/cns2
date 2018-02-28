var orm = require('../orm');

// Related Models

var AreaOfService = orm.bookshelf.Model.extend({
	
    tableName: 'tbl_area_of_services',
    idAttribute: 'area_id',
    /*completedDealsCount : function(){ 
		return this.hasMany(Deals, 'userId'); 
	}*/
});
//tbl_area_of_services
module.exports = AreaOfService;
//Deals = require('./enquiry.model');