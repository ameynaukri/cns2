var orm = require('../orm');

// Related Models

var Address = orm.bookshelf.Model.extend({
    tableName: 'tbl_address',
    idAttribute: 'order_id'
});
module.exports = Address;