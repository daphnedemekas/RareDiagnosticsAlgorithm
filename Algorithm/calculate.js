var queries = require('./Algorithm/queries');
var q = require('q');
var db = require('./Algorithm/db_connection')
var gD = require('./Algorithm/getData');
var bm = require('./Algorithm/bayesionmodel');

let inputsymptoms = ["Headache", "Fever", "Myalgia", "Migraine"];

queries.getSymptoms(db, q, gD).then(function(query) {
  let symptoms = query;

queries.getDiseases(db, q, gD).then(function(query) {
  let diseases = query;

queries.getInheritance(db, q, gD).then(function(query) {
    let inheritance = query;

queries.getCorrelations(db, q, gD).then(function(query) {
    var correlations = list;
    let matrix = gD.getCorrelationMatrix(correlations);
    let weights = bm.weights(correlations);
    var posterior = bm.likelihood(inputsymptoms, db, gD, matrix, weights, inheritance, symptoms);

    let totalsymptomcount = 0;
    let prior = 1;
    let values = []

    for (const [key, value] of posterior.entries()) {
      values.push(key);
    }

    values.sort(function(a, b){  return b - a;});

      // we print the 10 most likely diseases
    for (var i=0; i< 10; i++) {
      console.log(diseases.get(posterior.get(values[i])));
      console.log(values[i])
    }
    db.end();


  });

});
});
});
