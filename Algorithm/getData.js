
function getSymptoms(db) {
  var symptoms = [];
  db.query("SELECT * FROM Symptom", function (err, rows, fields) {
  if (err) throw err;
    rows.forEach( (row) => {
    symptoms.push(`${row.id}  ${row.symptom_name}`);
    });
});
return symptoms
}

function getDiseases() {
  var diseases = []
    db.query("SELECT * FROM Disease", function (err, rows, fields) {
      if (err) throw err;
      rows.forEach( (row) => {
      diseases.push(`${row.orpha_number}  ${row.disease_name}`);
    });
});
return diseases
db.end()
}

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


function getSymptomInheritance() {
  var inheritance = []
    db.query("SELECT * FROM SymptomInheritance", function (err, rows, fields) {
      if (err) throw err;
      rows.forEach( (row) => {
      inheritance.push(`${row.superclass_id} ${row.sublcass_id} `);
    });
});
return inheritance;
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
      entry.push(correlation[0])
    }
  }
  return matrix;
  }

module.exports = {
    getCorrelationMatrix,
    makeQuery,
};
