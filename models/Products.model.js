var orm = require('../orm');

// Related Models

var Products = orm.bookshelf.Model.extend({
    tableName: 'tbl_product_details',
    idAttribute: 'id',
    productDetail: function() {
        return this.belongsTo(admin, "product_id")
    }
});
var admin = require('./admin.model');
module.exports = Products;