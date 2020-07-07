//Class for an Algorithm.

// This class is just a blueprint for a generic algorithm.
// Using this will allows for swift testing/adding/deleting of algorithms.
// Name: Displayed name of the alogorithm.
// rankFunction: The function which performs the search and returns the top 10 diseases.
//         input: AlgorithmQuery structure (see below for example)
//         returns: a Promise which hands of over an array [{score: Float, disease: Disease}].
var Algorithm = function(name, rankFunction) {
  this.name = name;
  this.rank = rankFunction;
}

module.exports = Algorithm
