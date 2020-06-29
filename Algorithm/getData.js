
function makeQuery(db, q, query_str, element1, element2, element3)
{
  list = []
  var deferred = q.defer(); // Use Q

  var quer = db.query(query_str, function (err, rows, fields) {
    //if (err) throw err;
    if (err) {
        //throw err;
        deferred.reject(err);
    }
    else {
      rows.forEach( (row) => {
        entry = []
        entry.push(`${row[element1]}`);
        entry.push(`${row[element2]}`);
        if (`${row[element3]}`) {
          entry.push(`${row[element3]}`);
        }
        list.push(entry);
        });
        deferred.resolve(list);
      }
    });
    db.end()
 //var query = connection.query(query_str, function (err, rows, fields) {
return deferred.promise;
}

// [disease, symptom, frequency]
function getCorrelationMatrix(correlations) {
  var matrix = [];
  var disease = correlations[0][0];
  var entry = [disease];
  var count = 0;
  for (correlation of correlations) {
    var symptom = []
    if (entry[0] == correlation[0]) {
      // we have the first disease still
      symptom.push(correlation[1]);
      symptom.push(correlation[2]);
      entry.push(symptom);
    }
    else {
      count += 1;
      matrix.push(entry);
      entry = [correlation[0]];
    }
  }
  return matrix;
  }

function getWeights(correlations) {
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
    getCorrelationMatrix,
    makeQuery,
    getWeights
};
