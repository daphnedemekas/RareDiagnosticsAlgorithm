
function likelihood(inputsymptoms, db, gD, matrix, weights, inheritance, symptoms)  {

  var likelihoodMap = new Map();
  let totalsymptomcount = 0;
  let input = [];
  for (i of inputsymptoms) {
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

      else {
        importance *= weights.get(symptom[0]);
      }
    }
    if (matches != 0) {

      let likelihood = (frequency / frequencysum) * (matches/num_input) * importance;

      likelihoodMap.set(likelihood, correlation[0])
    }
  }



  console.log("do you have any of the following symptoms? " + return_subclass )
  return likelihoodMap;
}

function prior() {
  return 1;
}

function subclasses(inputsymptoms, inheritance) {
  let subclasses = [];
  for (i of inheritance) {
    if (inputsymptoms.includes(i[0]) && !subclasses.includes(i[1])) {
      subclasses.push(i[1]);
    }
  }
  return subclasses;
}

function superclasses(inputsymptoms, inheritance) {
  let superclasses = [];
  for (i of inheritance) {
    if (inputsymptoms.includes(i[1]) && !superclasses.includes(i[0])) {
      superclasses.push(i[0]);
    }
  }
  return superclasses;
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
  superclasses,
  subclasses
};
