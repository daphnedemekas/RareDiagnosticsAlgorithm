var bayesian = require('./BayesianAlgorithm/bayesian');
var distance = require('./DistanceAlgorithm/distance');
var combination = require('./Bayes_Distance_combo/combination');


let input_symptoms = ['Hypertension', 'Portal hypertension', 'Umbilical hernia', 'Ascites', 'Splenomegaly', 'Iron deficiency anemia', 'Polycythemia', 'Anemia', 'Acidosis', 'Pulmonary embolism', 'Hematemesis', 'Colitis', 'Intestinal bleeding', 'Duodenal ulcer', 'Venous thrombosis', 'Portal vein thrombosis', 'Hernia'];

var bayesian = require('./BayesianAlgorithm/bayesian');

bayesian.likelihoodCalculator(input_symptoms).then(ranking => {
  var ordered_ranking = ranking.sort(function(a,b){return b.score - a.score})
  var results = []
  for (var i=0; i < 10; i++){
    results.push({name: ordered_ranking[i].disease.disease_name,score: ordered_ranking[i].score})
  }
  console.log('Bayesian Test Results')
  console.log(results)
})


distance.distanceCalculator(input_symptoms).then(ranking => {
  var ordered_ranking = ranking.sort(function(a,b){return a.score - b.score})
  var results = []
  for (var i=0; i < 10; i++){
    results.push({name: ordered_ranking[i].disease.disease_name,score: ordered_ranking[i].score})
  }
  console.log('Distance Test Results')
  console.log(results)
})

combination.combination(input_symptoms).then(ranking => {
  var ordered_ranking = ranking.sort(function(a,b){return a.score - b.score})
  var results = []
  for (var i=0; i < 10; i++){
    results.push({name: ordered_ranking[i].disease.disease_name,score: ordered_ranking[i].score})
  }
  console.log('Combination Test Results')
  console.log(results)
})
