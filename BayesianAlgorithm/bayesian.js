// var queries = require(__dirname+'/queries');
// var q = require('q');
// var database = require(__dirname+'/db_connection')
// var getdata_controller = require(__dirname+'/getData');

var db = require('../controllers/DatabaseConnection')
var Disease = db.Disease;
var Symptom = db.Symptom;
const {Op} = require('sequelize');


async function getParentSymptoms(input_symptoms) {
  return Symptom.findAll({
    include: {
      model: Symptom,
      as:   'Children',
      where: {
        symptom_name:{
          [Op.in]: input_symptoms
        }
      }
    }
  })
}

// Input symptoms by name: ['Pain','Fever']
// Returns: array of score/disease tuple: [{disease: Disease, score: float}]
//TODO: Not case sensitive
async function likelihoodCalculator(input_symptoms) {
  //The results array we return later
  var results = []
  var parent_symptoms = await getParentSymptoms(input_symptoms);

  //We put this in a variable for later use.
  let number_of_input_symptoms = parseFloat(input_symptoms.length)

  //Pull every disease into memory. TODO: Make request a bit finer.
  var diseases = await Disease.findAll({include: Symptom})
  //TODO: Take into account superclasses
  //We iterate through each disease and calculate their score.
  for (var disease of diseases){
    // Initial some computational variables
    var frequency = 0.0;
    var matches = 0.0;
    var importance  = 1.0; //We don't actually use this at the moment.
    var frequency_sum = 0.0;

    //Example Symptom object (for easy reference)
    // {
    //   id: 'HP:0000003',
    //   symptom_name: 'Multicystic kidney dysplasia',
    //   definition: 'Multicystic dysplasi...',
    //   Correlation: { disease_orpha: '564', symptom_id: 'HP:0000003', frequency: 0.895 }
    // }
    for (var symptom of disease.Symptoms) {
      frequency_sum += parseFloat(symptom.Correlation.frequency);
      // If one of the input symptoms matches this symptom
      if (input_symptoms.includes(symptom.symptom_name)) {
        matches += 1;
        frequency += parseFloat(symptom.Correlation.frequency);
      }
      //There is no match, so pull parent symptoms and see if they might match.
      else {
        var parent_symptoms_names = parent_symptoms.map(sym => sym.symptom_name);
        if (parent_symptoms_names.includes(symptom.symptom_name)){
          matches += 1;
          frequency += parseFloat(symptom.Correlation.frequency);
        }
      }

      //else if: deal with subclasses

      // If there was at least on symptom match
      if (matches != 0) {
        let likelihood = (frequency / frequency_sum) * (matches/number_of_input_symptoms);
        results.push({
          disease: disease,
          score: likelihood
        })
      }
    }
  }
  return results;
}

// likelihood function takes the input symptoms of the patient
// and returns a Map of key value pairs
// Key = the likelihood of a specific disease given those Symptoms
// Value = the orpha number of the disease
    // this is because we can then get the disease back given its likelihood (in calculate) since we only
    // want the diseases with the highest likelihoods
// function likelihood(input_symptoms, database, getdata_controller, matrix, inheritance, symptoms)  {
//
//   var likelihood_map = new Map();
//   let total_symptomcount = 0;
//   let input = [];
//   for (i of input_symptoms) {
//     input.push(symptoms.get(i));
//   }
//
//   let superclasses = module.exports.superclasses(input, inheritance);
//   let subclasses = module.exports.subclasses(input, inheritance);
//   let return_subclass = [];
//
//   // we calculate the likelihood for all diseases
//   for (correlation of matrix) {
//     let frequency = 0;
//     let matches = 0;
//     let importance = 1;
//
//
//     let num_diseases = matrix.length;
//
//     let num_input = parseFloat(input.length);
//     let frequencysum = 0;
//     // correlation = (disease, symptom, frequency)
//
//     for (const symptom of correlation.slice(1)) {
//       // symptom = [HP, frequency]
//       frequencysum += parseFloat(symptom[1]);
//
//       if (input.includes(symptom[0])) {
//         matches += 1;
//         frequency += parseFloat(symptom[1]);
//       }
//
// // // NOTE:
// // I would say let's only do this on the first round. if they then specify the symptoms we suggest,
// // we no longer take into account the superclasses
//       else if (superclasses.includes(symptom[0])) {
//       matches += 1;
//         frequency += parseFloat(symptom[1]);
//       }
//
//       else if (subclasses.includes(symptom[0]) && !return_subclass.includes(symptoms.get(symptom[0]))) {
//         return_subclass.push(symptoms.get(symptom[0]))
//       }
//     }
//
//     if (matches != 0) {
//       let likelihood = (frequency / frequencysum) * (matches/num_input);
//       likelihood_map.set(likelihood, correlation[0])
//     }
//   }
//
//   // want to ask about the subclasses of symptoms that were inputted
//   // after the user selects any subclasses the code would be run again
//   // but would not take into account symptom superclasses anymore
//   console.log("do you have any of the following symptoms? " + return_subclass )
//   return likelihood_map;
// }
//
// // currently we do not have any prior (uninformative prior)
// function prior() {
//   return 1;
// }
//
// // this takes the input symptom of the user and the inheritance map of the Symptoms
// // and returns a list of all of the subclasses of the inputted symptoms
// function subclasses(input_symptoms, inheritance) {
//   let subclasses = [];
//   for (i of inheritance) {
//     if (input_symptoms.includes(i[0]) && !subclasses.includes(i[1])) {
//       subclasses.push(i[1]);
//     }
//   }
//   return subclasses;
// }
//
// // this takes the input symptoms of the user and the inheritance map of the Symptoms
// // and returns a list of all of the superclasses of the inputted symptoms
// function superclasses(input_symptoms, inheritance) {
//   let superclasses = [];
//   for (i of inheritance) {
//     if (input_symptoms.includes(i[1]) && !superclasses.includes(i[0])) {
//       superclasses.push(i[0]);
//     }
//   }
//   return superclasses;
// }
//
// // this takes in all diseases and their Symptoms
// // and returns a key value map
// // key = a symptom
// // value = the "weight" of the symptom calculated by (how many diseases have that symptom / total number of Diseases)
// // we are currently not using this
// function weights(correlations) {
//   let counts = new Map();
//   let count = 0;
//   let total = correlations.length;
//   for (var correlation of correlations) {
//     count += 1;
//     var hp = correlation[1];
//     if (counts.has(hp)) {
//       counts.set(hp, (counts.get(hp)*total+1)/total);
//     }
//     else {
//       counts.set(hp, 1/total);
//     }
//   }
//   return counts;
// }
//
// //Input: Array, contains list of symptoms
// //Output: Top 10 diseases from this test (format yet uknown), to be handled by callback.
// const bayesianAlgorithm = (input_symptoms) => new Promise((resolve) => {
//   queries.getSymptoms(database, q, getdata_controller).then(function(query) {
//     let symptoms = query;
//
//   queries.getDiseases(database, q, getdata_controller).then(function(query) {
//     let diseases = query;
//
//   queries.getInheritance(database, q, getdata_controller).then(function(query) {
//       let inheritance = query;
//
//   queries.getCorrelations(database, q, getdata_controller).then(function(query) {
//       var correlations = list;
//       // matrix of diseases and corresponding symptoms
//       let matrix = getdata_controller.getCorrelationMatrix(correlations);
//
//       //let weights = bm.weights(correlations);
//
//       // this is a map of diseases and their corresponding likelihood based on the input symptoms
//       var posterior = likelihood(input_symptoms, database, getdata_controller, matrix, inheritance, symptoms);
//
//       let totalsymptomcount = 0;
//       let prior = 1;
//       let values = []
//
//       for (const [key, value] of posterior.entries()) {
//         values.push(key);
//       }
//
//       values.sort(function(a, b){  return b - a;});
//
//       // Axel'ls rambling: The posterior object is a dictionary which contains the
//       // likelihood as key and the disease (Orhpanet number? name?) as value.
//       // The keys are then sorted in descending order.
//       // Following this, we pull the top 10 diseases in order.
//       // we print the 10 most likely diseases
//
//       var disease_list = [];
//       for (var i=0; i< 10; i++) {
//         console.log(diseases.get(posterior.get(values[i])));
//         disease_list.push(diseases.get(posterior.get(values[i])))
//       }
//       resolve(disease_list)
//     });
//   });
//   });
//   });
// })
//
// //TODO: Delete this (just don't want things to break)
// var bayesianTest = function(){}
//
// module.exports = {
//   likelihood,
//   weights,
//   superclasses,
//   subclasses,
//   bayesianTest,
//   bayesianAlgorithm
// };

module.exports = {
  likelihoodCalculator
}
