var queries = require('./BayesianAlgorithm/queries');
var q = require('q');
var database = require('./BayesianAlgorithm/db_connection')
var getdata_controller = require('./BayesianAlgorithm/getData');
var bayesionmodel = require('./BayesianAlgorithm/bayesionmodel');
var distance = require('euclidean-distance')

let inputsymptoms = ["Abnormality of skin pigmentation", 'Skin rash', 'Erythematous papule', "Abnormality of the nail", "Macule", 'Erythema', 'White papule', "Recurrent skin infection", 'Maceration', 'Hyperkeratotic papule', 'Acantholysis', 'Papule']
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

    let superclasses = bayesionmodel.superclasses(input, inheritance);
    let subclasses = bayesionmodel.subclasses(input, inheritance);
    let return_subclass = [];

    // symptom matrix is a vector of 1.5s
    var symptom_vector = []
    for (const symptom of inputsymptoms) {symptom_vector.push(1.5)}

    for (correlation of matrix) {
      var disease_vector = []

      for (const symptom of correlation.slice(1)) {
        // symptom = [HP, frequency]
        if (input.includes(symptom[0]) || superclasses.includes(symptom[0])) {
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
        else if (subclasses.includes(symptom[0]) && !return_subclass.includes(symptoms.get(symptom[0]))) {
        return_subclass.push(symptoms.get(symptom[0]))
      }
    }

      let num_zeros = symptom_vector.length - disease_vector.length;

      for (var i=0; i < num_zeros; i++ ) { disease_vector.push(0) }

      if (disease_vector[0] != 0) {
        var d = distance(disease_vector, symptom_vector);
        diseaselist.push([correlation[0],d])
        }
    }

    console.log("do you have any of the following symptoms? " + return_subclass )

    diseaselist.sort(function(a,b){return a[1] - b[1];});
    for (var i=0; i< 10; i++) {
      console.log(diseases.get(diseaselist[i][0]));
    }

    let count = 0;

    for (var i=0; i< diseaselist.length; i++) {
      count += 1;
      if (diseases.get(diseaselist[i][0]) == "Darier disease")  {
        console.log(count)
      }
    }

    database.end();

  });
});
});
});
