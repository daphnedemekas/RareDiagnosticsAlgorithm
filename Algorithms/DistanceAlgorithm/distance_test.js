var distance = require('./distance');

let input_symptoms = ['Hypertension', 'Portal hypertension', 'Umbilical hernia', 'Ascites', 'Splenomegaly', 'Iron deficiency anemia', 'Polycythemia', 'Anemia', 'Acidosis', 'Pulmonary embolism', 'Hematemesis', 'Colitis', 'Intestinal bleeding', 'Duodenal ulcer', 'Venous thrombosis', 'Portal vein thrombosis', 'Hernia'];
distance.distanceCalculator(input_symptoms).then(ranking => {
  var ordered_ranking = ranking.sort(function(a,b){return a.score - b.score})
  var results = []
  for (var i=0; i < 10; i++){
    results.push({name: ordered_ranking[i].disease.disease_name,score: ordered_ranking[i].score})
  }
  console.log('Distance Test Results')
  console.log(results)
})
