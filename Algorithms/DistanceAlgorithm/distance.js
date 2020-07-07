var db = require('../../controllers/DatabaseConnection')
var Disease = db.Disease;
var Symptom = db.Symptom;
//const {Op} = require('sequelize');

var distance_function = require('euclidean-distance')

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

async function distanceCalculator(input_symptoms) {
  //The results array we return later
  var results = []
  var parent_symptoms = await db.getParentSymptoms(input_symptoms);
  var parent_symptoms_names = parent_symptoms.map(sym => sym.symptom_name)
  // here we just add the parent symptoms to the input symptoms so we treat
  // all superclasses as symptoms
  for (superclass of parent_symptoms_names) {input_symptoms.push(superclass)};

  var diseases = await Disease.findAll({include: Symptom})

  // initialize the symptom vector (currently all symptom point values are 1.5 but this would change with input symptom frequency)
  var symptom_vector = Array((input_symptoms.length)).fill(1.5);
  let unchanged_vector = Array((input_symptoms.length)).fill(0);

  for (var disease of diseases){
    var disease_vector = Array((input_symptoms.length)).fill(0);
    // disease symptoms
    for (var symptom of disease.Symptoms) {
      if (input_symptoms.includes(symptom.symptom_name)) {
        index = input_symptoms.indexOf(symptom.symptom_name);
        if (symptom.Correlation.frequency == 0.895) {disease_vector.splice(index,1,3);}
        if (symptom.Correlation.frequency == 0.545) {disease_vector.splice(index,1,2);}
        if (symptom.Correlation.frequency == 0.17) {disease_vector.splice(index,1,1); }
      }
    }
    // example:
    // s = 1.5 1.5 1.5 1.5 1.5
    // d = 1   0   3    2   0
    if (!arraysEqual(disease_vector,unchanged_vector)) {
      var distance = (distance_function(disease_vector, symptom_vector));
      results.push({
        disease: disease,
        score: distance
      })
    }
  }
  return results;
}

module.exports = {
  distanceCalculator
}
