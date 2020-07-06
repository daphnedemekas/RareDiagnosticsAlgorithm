console.log(__dirname)
var queries = require(__dirname+'/queries');
var q = require('q');
var database = require(__dirname+'/db_connection')
var getdata_controller = require(__dirname+'/getData');

// likelihood function takes the input symptoms of the patient
// and returns a Map of key value pairs
// Key = the likelihood of a specific disease given those Symptoms
// Value = the orpha number of the disease
    // this is because we can then get the disease back given its likelihood (in calculate) since we only
    // want the diseases with the highest likelihoods
function likelihood(input_symptoms, database, getdata_controller, matrix, inheritance, symptoms)  {

  var likelihood_map = new Map();
  let total_symptomcount = 0;
  let input = [];
  for (i of input_symptoms) {
    input.push(symptoms.get(i));
  }

  let superclasses = module.exports.superclasses(input, inheritance);
  let subclasses = module.exports.subclasses(input, inheritance);
  let return_subclass = [];

  // we calculate the likelihood for all diseases
  for (correlation of matrix) {
    let frequency = 0;
    let matches = 0;
    let importance = 1;

    let num_diseases = matrix.length;

    let num_input = parseFloat(input.length);
    let frequencysum = 0;
    // correlation = (disease, symptom, frequency)

    for (const symptom of correlation.slice(1)) {
      // symptom = [HP, frequency]
      frequencysum += parseFloat(symptom[1]);

      if (input.includes(symptom[0])) {
        matches += 1;
        frequency += parseFloat(symptom[1]);
      }

// // NOTE:
// I would say let's only do this on the first round. if they then specify the symptoms we suggest,
// we no longer take into account the superclasses
      else if (superclasses.includes(symptom[0])) {
      matches += 1;
        frequency += parseFloat(symptom[1]);
      }

      else if (subclasses.includes(symptom[0]) && !return_subclass.includes(symptoms.get(symptom[0]))) {
        return_subclass.push(symptoms.get(symptom[0]))
      }
    }
    if (matches != 0) {
      let likelihood = (frequency / frequencysum) * (matches/num_input);
      likelihood_map.set(likelihood, correlation[0])
    }
  }

  // want to ask about the subclasses of symptoms that were inputted
  // after the user selects any subclasses the code would be run again
  // but would not take into account symptom superclasses anymore
  console.log("do you have any of the following symptoms? " + return_subclass )
  return likelihood_map;
}

// currently we do not have any prior (uninformative prior)
function prior() {
  return 1;
}

// this takes the input symptom of the user and the inheritance map of the Symptoms
// and returns a list of all of the subclasses of the inputted symptoms
function subclasses(input_symptoms, inheritance) {
  let subclasses = [];
  for (i of inheritance) {
    if (input_symptoms.includes(i[0]) && !subclasses.includes(i[1])) {
      subclasses.push(i[1]);
    }
  }
  return subclasses;
}

// this takes the input symptoms of the user and the inheritance map of the Symptoms
// and returns a list of all of the superclasses of the inputted symptoms
function superclasses(input_symptoms, inheritance) {
  let superclasses = [];
  for (i of inheritance) {
    if (input_symptoms.includes(i[1]) && !superclasses.includes(i[0])) {
      superclasses.push(i[0]);
    }
  }
  return superclasses;
}

// this takes in all diseases and their Symptoms
// and returns a key value map
// key = a symptom
// value = the "weight" of the symptom calculated by (how many diseases have that symptom / total number of Diseases)
// we are currently not using this
function weights(correlations) {
  let counts = new Map();
  let count = 0;
  let total = correlations.length;
  for (var correlation of correlations) {
    count += 1;
    var hp = correlation[1];
    if (counts.has(hp)) {
      counts.set(hp, (counts.get(hp)*total+1)/total);
    }
    else {
      counts.set(hp, 1/total);
    }
  }
  return counts;
}

//Input: Array, contains list of symptoms
//Output: Top 10 diseases from this test (format yet uknown), to be handled by callback.
const bayesianAlgorithm = (input_symptoms) => new Promise((resolve) => {
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
      var posterior = likelihood(input_symptoms, database, getdata_controller, matrix, inheritance, symptoms);

      let totalsymptomcount = 0;
      let prior = 1;
      let values = []

      for (const [key, value] of posterior.entries()) {
        values.push(key);
      }

      values.sort(function(a, b){  return b - a;});

      // Axel'ls rambling: The posterior object is a dictionary which contains the
      // likelihood as key and the disease (Orhpanet number? name?) as value.
      // The keys are then sorted in descending order.
      // Following this, we pull the top 10 diseases in order.
      // we print the 10 most likely diseases

      var disease_list = [];
      for (var i=0; i< 10; i++) {
        console.log(diseases.get(posterior.get(values[i])));
        disease_list.push(diseases.get(posterior.get(values[i])))
      }
      resolve(disease_list)
    });
  });
  });
  });
})

//TODO: Delete this (just don't want things to break)
var bayesianTest = function(){}

module.exports = {
  likelihood,
  weights,
  superclasses,
  subclasses,
  bayesianTest,
  bayesianAlgorithm
};
