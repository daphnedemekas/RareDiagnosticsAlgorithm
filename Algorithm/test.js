var queries = require('./Algorithm/queries');
var q = require('q');
var db = require('./Algorithm/db_connection')
var gD = require('./Algorithm/getData');
var bm = require('./Algorithm/bayesionmodel');

let inputsymptoms = ["HP:0002315", "HP:0002321", "HP:0002367"];


queries.getCorrelations(db, q, gD).then(function(query) {
  let totalsymptomcount = 0;
  var correlations = list;
  let matrix = gD.getCorrelationMatrix(correlations);
  let weights = bm.weights(correlations);
  let prior = 1;
  var posterior = bm.likelihood(inputsymptoms, db, gD, matrix, weights) ;
  let values = []

  for (const [key, value] of posterior.entries()) {
    values.push(key);
  }
  values.sort()

  // we print the 10 most likely diseases
  for (var i=0; i< 10; i++) {
    console.log(posterior.get(values[i]));
  }

  
});
