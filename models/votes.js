'use strict';


var pg = require('pg');
var q = require('q');

// for local test
var username = "robinboehm";
var password = "postgres";
var host = "localhost";
var dbName = "petrusapp";

var conStringPost = process.env.DATABASE_URL || 'postgres://' + username + ':' + password + '@' + host +
  '/' + dbName;

module.exports = {
  count: count,
  getByDate: getByDate,
  add: add,
  getByDateAndLocation: getByDateAndLocation,
  getLocation: getLocation
};

function getByDate(year, month, day) {
  var deferred = q.defer();
  var client = new pg.Client(conStringPost);
  client.connect(function (err) {
    if (err) {
      return console.error('could not connect to postgres', err);
    }

    // SQL Injection
    client.query('SELECT Count(*) as count, avg(temperature) as temperature, weather from votes ' +
      'WHERE "date" = $1::date ' +
      'GROUP BY weather',
      [year + '-' + month + '-' + day],
      function (err, result) {
        if (err) {
          deferred.reject('error running query');
        }
        deferred.resolve(result.rows);
        client.end();
      }
    )
    ;
  });
  return deferred.promise;
}


function getByDateAndLocation(year, month, day, location) {
  var deferred = q.defer();
  var client = new pg.Client(conStringPost);
  client.connect(function (err) {
    if (err) {
      return console.error('could not connect to postgres', err);
    }

    // SQL Injection
    client.query('SELECT Count(*) as count, avg(temperature) as temperature, weather from votes ' +
      'WHERE "date" = $1::date and "location" = $2 ' +
      'GROUP BY weather',
      [year + '-' + month + '-' + day, location],
      function (err, result) {
        if (err) {
          deferred.reject('error running query');
        }
        deferred.resolve(result.rows);
        client.end();
      }
    )
    ;
  });
  return deferred.promise;
}


function getLocation(location) {
  var deferred = q.defer();
  var client = new pg.Client(conStringPost);
  client.connect(function (err) {
    if (err) {
      return console.error('could not connect to postgres', err);
    }

    // SQL Injection
    client.query('SELECT Count(*) as count, avg(temperature) as temperature, weather from votes ' +
      'WHERE "location" = $1 ' +
      'GROUP BY weather',
      [location],
      function (err, result) {
        if (err) {
          deferred.reject('error running query');
        }
        deferred.resolve(result.rows);
        client.end();
      }
    )
    ;
  });
  return deferred.promise;
}


function add(vote) {
  var deferred = q.defer();
  var client = new pg.Client(conStringPost);
  client.connect(function (err) {
    if (err) {
      return console.error('could not connect to postgres', err);
    }

    client.query('INSERT INTO votes(timestamp,weather,date,location,temperature) VALUES($1,$2,$3,$4,$5)',
      ["Now()", vote.weather, vote.date, vote.location, vote.temperature],
      function (err, result) {
        if (err) {
          deferred.reject('error running query');
        }
        deferred.resolve(result);
        client.end();
      });
  });
  return deferred.promise;
}

function count() {
  var deferred = q.defer();
  var client = new pg.Client(conStringPost);
  client.connect(function (err) {
    if (err) {
      return console.error('could not connect to postgres', err);
    }

    client.query('SELECT Count(*) as count from votes', function (err, result) {

      if (err) {
        deferred.reject('error running query');
      }
      deferred.resolve(result.rows[0].count);
      client.end();
    });
  });
  return deferred.promise;
}


