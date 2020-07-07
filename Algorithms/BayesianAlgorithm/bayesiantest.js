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
