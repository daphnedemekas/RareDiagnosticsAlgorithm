
// this function makes a general query to the SQL database
// returns a promise
function makeQuery(database, q, query_str, element1, element2, element3)
{
   list = []
   var deferred = q.defer(); // Use Q

  var quer = database.query(query_str, function (err, rows, fields) {
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
        if (`${row[element3]}` != "undefined") {
          entry.push(`${row[element3]}`);
        }
        list.push(entry);
        });
        deferred.resolve(list);
      }
    });

return deferred.promise;
}

//this function returns a matrix of correlation = [disease, symptom, frequency]
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

module.exports = {
    getCorrelationMatrix,
    makeQuery,
};
