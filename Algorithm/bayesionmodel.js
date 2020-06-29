
function likelihood(inputsymptoms, db, gD, matrix, weights)  {
  var likelihoodMap = new Map();
  let totalsymptomcount = 0;
      // we calculate the likelihood for all diseases
      for (correlation of matrix) {
        let frequency = 0;
        let matches = 0;
        let importance = 1;

        let num_diseases = matrix.length;

        let num_input = parseFloat(inputsymptoms.length);
        let frequencysum = 0;
        // correlation = (disease, symptom, frequency)

          for (const symptom of correlation.slice(1)) {
            // symptom = [HP, frequency]
            frequencysum += parseFloat(symptom[1]);

            if (inputsymptoms.includes(symptom[0])) {
              matches += 1;
              frequency += parseFloat(symptom[1]);
            }
            else {
              importance *= weights.get(symptom[0]);
            }
        }
        let likelihood = (frequency / frequencysum) * (matches/num_input) * importance;
        if (matches != 0) {
          likelihoodMap.set(likelihood, correlation[0])
      }
  }
  return likelihoodMap;
}

function prior() {
  return 1;
}

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

module.exports = {
    likelihood,
    weights,
};
