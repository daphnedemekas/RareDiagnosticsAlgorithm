var queries = require('./Algorithm/queries');
var q = require('q');
var db = require('./Algorithm/db_connection')
var gD = require('./Algorithm/getData');
var bm = require('./Algorithm/bayesionmodel');

queries.getSymptoms(db, q, gD);
