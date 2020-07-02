var express = require('express');
var router = express.Router();
var queries = require('../Algorithm/queries');
var q = require('q');
var database = require('../Algorithm/db_connection')
var getdata_controller = require('../Algorithm/getData');

/* GET home page. */
router.get('/', function(req, res, next) {
  var query = getdata_controller.makeQuery(database, q, "SELECT * FROM Symptom", "id", "definition", "symptom_name")
   .then(function(rows)  {
     var symptoms = list;
     res.render('index', { title: 'Express', symptoms: symptoms });
     // return symptoms;
   });
   // return query;
});

module.exports = router;
