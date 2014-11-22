var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function (db, callback) {
  db.createTable('votes', {
    id: {type: 'int', primaryKey: true, autoIncrement: true},
    timestamp: 'timestamp',
    temperature: 'int',
    weather: 'string',
    date: 'date'
  }, callback);
};

exports.down = function (db, callback) {
  db.dropTable('votes', callback);
};
