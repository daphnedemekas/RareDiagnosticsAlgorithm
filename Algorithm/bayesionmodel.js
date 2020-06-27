var queries = require('./Algorithm/queries');
var q = require('q');
var db = require('./Algorithm/db_connection')
var gD = require('./Algorithm/getData');// function posterior(diseases, symptoms, correlations, inheritance) {
//   prior = 1;
//   likelihood = likelihood();
//
// }
//

function likelihood(inputsymptoms, diseases, symptoms, correlations, inheritance, db, q, gD)  {
  queries.getMatrix(db, q, gD).then(function(query) {
    var matrix = query;
    for (correlation of query) {
      // we calculate the sum of the frequencies for each disease
      var frequency = 0;
      var matches = 0;
      var importance = 0;

      var num_input = parseFloat(inputsymptoms.length);
      var frequencysum = 0;

        for (const symptom of correlation.slice(1)) {
          // symptom = [HP, frequency]
          frequencysum += parseFloat(symptom[1]);

          if (inputsymptoms.includes(symptom[0])) {
            matches += 1;
            frequency += parseFloat(symptom[1]);
          }
          else {
            importance *= weight(symptom);
          }
        }


    }
  });
}

function weight(symptom, ) {
  var allsymptoms = [];
  queries.getMatrix(db, q, gD).then(function(query) {
    var matrix = query;
    for (correlation of matrix) {
      allsymptoms +=
    }
// TO DO FINISH THIS
});
}



// function likelihood(inputsymptoms, diseases, symptoms, correlations, inheritance) {
//   var matrix = queries.getMatrix();
//   for (var correlation: correlations) {
//     // calculate sum of frequencies of symptoms in disease
//     symptoms = correlations
//
//
// }
//
// }
