 // ORM For js.
var config = require('./config');
var filteration = require('bookshelf-filteration');
filteration.useDefaultFilters(true);

var knex = require('knex')({
  client: config.database.client,
  connection: config.database.connection
});

var bookshelf = require('bookshelf')(knex);
bookshelf.plugin(filteration.plugin);

module.exports = { bookshelf:bookshelf, knex:knex };
