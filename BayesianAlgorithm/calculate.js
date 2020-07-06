// problem is we always get diseases with very few symtpms
// want to emphasize similar symptoms over few symptoms
var queries = require('./BayesianAlgorithm/queries');
var q = require('q');
var database = require('./BayesianAlgorithm/db_connection')
var getdata_controller = require('./BayesianAlgorithm/getData');
var bayesionmodel = require('./BayesianAlgorithm/bayesionmodel');

let inputsymptoms =['Arthritis', 'Fever', 'Anorexia', 'Immunodeficiency', 'Arthralgia', 'Erythema', 'Neutrophilia', 'Hepatitis','Pharyngitis']
queries.getSymptoms(database, q, getdata_controller).then(function(query) {
  let symptoms = query;

queries.getDiseases(database, q, getdata_controller).then(function(query) {
  let diseases = query;

queries.getInheritance(database, q, getdata_controller).then(function(query) {
    let inheritance = query;

queries.getCorrelations(database, q, getdata_controller).then(function(query) {
    var correlations = list;
    // matrix of diseases and corresponding symptoms
    let matrix = getdata_controller.getCorrelationMatrix(correlations);

    //let weights = bm.weights(correlations);

    // this is a map of diseases and their corresponding likelihood based on the input symptoms
    var posterior = bayesionmodel.likelihood(inputsymptoms, database, getdata_controller, matrix, inheritance, symptoms);

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
      //console.log(values[i])
    }


    let count = 0;

    for (var i=0; i< 1000; i++) {
      count += 1;
      if (diseases.get(posterior.get(values[i])) == "Darier disease")  {
        console.log(count)
      }
    }

    database.end();

  });

});
});
});
