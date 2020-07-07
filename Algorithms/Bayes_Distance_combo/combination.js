var db = require('../../controllers/DatabaseConnection')
var Disease = db.Disease;
var Symptom = db.Symptom;
const {Op} = require('sequelize');
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

async function combination(input_symptoms) {
  var results = []
  let number_of_input_symptoms = parseFloat(input_symptoms.length)
  let unchanged_vector = Array((input_symptoms.length)).fill(0);
  var parent_symptoms = await db.getParentSymptoms(input_symptoms);
  // again we push superclasses to the input
  var parent_symptoms_names = parent_symptoms.map(sym => sym.symptom_name);

  for (superclass of parent_symptoms_names) {input_symptoms.push(superclass)};

  var diseases = await Disease.findAll({include: Symptom})

  // initialize the symptom vector (currently all symptom point values are 1.5 but this would change with input symptom frequency)
  var symptom_vector = Array((input_symptoms.length)).fill(1.5);

  for (var disease of diseases){
    var disease_vector = Array((input_symptoms.length)).fill(0);
    // initialize variables
    let matches = 0;
    let frequency_sum = 0;
    let frequency = 0;

    for (var symptom of disease.Symptoms) {
      frequency_sum += parseFloat(symptom.Correlation.frequency);
      // If one of the input symptoms matches this symptom
      if (input_symptoms.includes(symptom.symptom_name)) {
        matches += 1;
        frequency += parseFloat(symptom.Correlation.frequency);
        let index = input_symptoms.indexOf(symptom.name);
        if (symptom.frequency == 0.895) {disease_vector.splice(index,1,3);}
        if (symptom.frequency == 0.545) {disease_vector.splice(index,1,2);}
        if (symptom.frequency == 0.17) {disease_vector.splice(index,1,1);}
      }
    }

    if (!arraysEqual(disease_vector,unchanged_vector)) {
      var distance = (distance_function(disease_vector, symptom_vector));
      var likelihood = (frequency / frequency_sum) * (matches/number_of_input_symptoms);
      var score = distance * (1-likelihood);
      results.push({
        disease: disease,
        score: score
      });
    }
  }
  return results;
}

module.exports = {
  combination
}
