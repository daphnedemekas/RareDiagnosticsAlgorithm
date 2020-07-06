// problem is we always get diseases with very few symtpms
// want to emphasize similar symptoms over few symptoms

var bayesian = require('./BayesianAlgorithm/bayesian');

let input_symptoms = ['Arthritis','Fever','Anorexia','Immunodeficiency','Arthralgia','Erythema','Neutrophilia','Hepatitis','Pharyngitis']

bayesian.likelihoodCalculator(input_symptoms).then(ranking => {
  var ordered_ranking = ranking.sort(function(a,b){return b.score - a.score})
  var results = []
  for (var i=0; i < 10; i++){
    results.push({name: ordered_ranking[i].disease.disease_name,score: ordered_ranking[i].score})
  }
  console.log(results)
})
// queries.getSymptoms(database, q, getdata_controller).then(function(query) {
//   let symptoms = query;
//
// queries.getDiseases(database, q, getdata_controller).then(function(query) {
//   let diseases = query;
//
// queries.getInheritance(database, q, getdata_controller).then(function(query) {
//     let inheritance = query;
//
// queries.getCorrelations(database, q, getdata_controller).then(function(query) {
//     var correlations = list;
//     // matrix of diseases and corresponding symptoms
//     let matrix = getdata_controller.getCorrelationMatrix(correlations);
//
//     //let weights = bm.weights(correlations);
//
//     // this is a map of diseases and their corresponding likelihood based on the input symptoms
//     var posterior = bayesian.likelihood(inputsymptoms, database, getdata_controller, matrix, inheritance, symptoms);
//
//     let totalsymptomcount = 0;
//     let prior = 1;
//     let values = []
//
//     for (const [key, value] of posterior.entries()) {
//       values.push(key);
//     }
//
//     values.sort(function(a, b){  return b - a;});
//
//     // Axel'ls rambling: The posterior object is a dictionary which contains the
//     // likelihood as key and the disease (Orhpanet number? name?) as value.
//     // The keys are then sorted in descending order.
//     // Following this, we pull the top 10 diseases in order.
//     // we print the 10 most likely diseases
//
//     for (var i=0; i< 10; i++) {
//       console.log(diseases)
//       console.log(diseases.get(posterior.get(values[i])));
//       //console.log(values[i])
//     }
//
//
//     let count = 0;
//
//     // This prints the rank of the current disease we are testing against
//     // the algorithm ranking. The name of the disease here has to be changed by hand.
//     for (var i=0; i< 1000; i++) {
//       count += 1;
//       if (diseases.get(posterior.get(values[i])) == "Adult-onset Still disease")  {
//         console.log(count)
//       }
//     }
//
//     database.end();
//
//   });

// });
// });
// });
