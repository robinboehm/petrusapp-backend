var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.addColumn('votes','location','string',callback);
};

exports.down = function(db, callback) {
  db.removeColumn('votes','location',callback);
};
