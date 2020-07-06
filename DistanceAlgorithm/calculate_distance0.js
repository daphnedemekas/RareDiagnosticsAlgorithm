var queries = require('./BayesianAlgorithm/queries');
var q = require('q');
var database = require('./BayesianAlgorithm/db_connection')
var getdata_controller = require('./BayesianAlgorithm/getData');
var bayesian = require('./BayesianAlgorithm/bayesian');
var distance = require('euclidean-distance')

let inputsymptoms = ['Arthritis', 'Fever', 'Anorexia', 'Immunodeficiency', 'Arthralgia', 'Erythema', 'Neutrophilia', 'Hepatitis','Pharyngitis']



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

    var diseaselist = []

    var input = [];
    for (i of inputsymptoms) {
      input.push(symptoms.get(i));
    }

    // symptom matrix is a vector of 1.5s

    for (correlation of matrix) {
      var symptom_vector = []
      for (const symptom of inputsymptoms) {symptom_vector.push(1.5)}
      var disease_vector = []

      for (const symptom of correlation.slice(1)) {
        // symptom = [HP, frequency]
        if (input.includes(symptom[0])) {
          let frequency = parseFloat(symptom[1]);
          if (frequency == 0.895) {
            disease_vector.push(3);
          }
          else if (frequency == 0.545) {
            disease_vector.push(2);
          }
          else if (frequency = 0.17) {
            disease_vector.push(1);
          }
        }
        else {
          disease_vector.push(0);
        }

      }

      if (disease_vector.length == 0) {
        disease_vector.push(0)
      }

      for (var i=0; i < (correlation.slice(1).length - input.length); i++ ) {symptom_vector.push(0)}


      if (disease_vector[0] != 0) {
      var d = (distance(disease_vector, symptom_vector))^(2/500);
      console.log(d)
      diseaselist.push([correlation[0],d])
      }
    }

    diseaselist.sort(function(a,b){return a[1] - b[1];});
    for (var i=0; i< 35; i++) {
      console.log(diseases.get(diseaselist[i][0]));
    }

    let count = 0;

    for (var i=0; i< 35; i++) {
      count += 1;
      if (diseases.get(diseaselist[i][0]) == "Adult-onset Still disease")  {
        console.log(count)
      }
    }

    database.end();

  });

});
});
});
