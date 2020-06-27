
async function getMatrix(db, q, getData) {
  var query = await getData.makeQuery(db, q, "SELECT * FROM Correlation", "disease_orpha", "symptom_id", "frequency")
   .then(function(rows)  {
     var correlations = list;
     var matrix = getData.getCorrelationMatrix(correlations);
     return matrix;
   });
   return query;
}


module.exports = {
    getMatrix
};
