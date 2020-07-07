// var queries = require(__dirname+'/queries');
// var q = require('q');
// var database = require(__dirname+'/db_connection')
// var getdata_controller = require(__dirname+'/getData');

var db = require('../../controllers/DatabaseConnection')
var Disease = db.Disease;
var Symptom = db.Symptom;
const {Op} = require('sequelize');

// Just a wrapper to make the code not too crowded.
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
    }

    // If there was at least oen symptom match
    if (matches != 0) {
      let likelihood = (frequency / frequency_sum) * (matches/number_of_input_symptoms);
      results.push({
        disease: disease,
        score: likelihood
      })
    }
  }
  return results;
}

module.exports = {
  likelihoodCalculator
}
