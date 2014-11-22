'use strict';

// import express
var express = require('express');
var votes = require('./models/votes');

// init express app
var app = express();
app.use(express.bodyParser());
app.use(express.cookieParser());

// set CORS headers for all requests
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true'); // in correspondence with 'withCredentials' flag in XHR
  // to make XHR send cookies with a CORS request
  next();
});

app.options('*', function (req, res) {
  res.send(200);
});

// ###################################
// ## Components
// ###################################

// /api/components#list
app.get('/', function (req, res) {
  votes.count()
    .then(function (count) {
      res.json(count);
    });
});

app.get('/:location', function (req, res) {
  votes.getLocation(req.params.location)
    .then(function (count) {
      res.json(count);
    });
});

app.get('/:year/:month/:day', function (req, res) {
  votes.getByDate(req.params.year, req.params.month, req.params.day)
    .then(function (count) {
      res.json(count);
    });
});

app.get('/:year/:month/:day/:location', function (req, res) {
  votes.getByDateAndLocation(req.params.year, req.params.month, req.params.day, req.params.location)
    .then(function (count) {

      res.json(count);
    });
});
app.post('/', function (req, res) {
  votes
    .add(req.body)
    .then(function () {
      var dateArray = req.body.date.split('-');
      return votes.getByDateAndLocation(dateArray[0], dateArray[1], dateArray[2], req.body.location);
    })
    .then(function (count) {
      res.json(count);
    });
})
;


// start listening
app.listen(process.env.PORT || 9000, function () {
  console.log('Server listening on port ' + (process.env.PORT || 9000));
});