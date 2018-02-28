var orm = require('../orm');

// Related Models

var Products = orm.bookshelf.Model.extend({
  tableName: 'tbl_product_details',
  idAttribute: 'product_id'
});
module.exports = Products; 
