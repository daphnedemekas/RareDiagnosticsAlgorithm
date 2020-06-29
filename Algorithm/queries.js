
async function getCorrelations(db, q, getData) {
  var query = await getData.makeQuery(db, q, "SELECT * FROM Correlation", "disease_orpha", "symptom_id", "frequency")
   .then(function(rows)  {
     var correlations = list;
     return correlations;
   });
   return query;
}

async function getDiseases(db, q, getData) {
  var query = await getData.makeQuery(db, q, "SELECT * FROM Disease", "orpha_number", "type", "disease_name")
   .then(function(rows)  {
     var correlations = list;
     return correlations;
   });
   return query;
}

async function getInheritance(db, q, getData) {
  var query = await getData.makeQuery(db, q, "SELECT * FROM SymptomInheritance", "superclass_id", "subclass_id");
   .then(function(rows)  {
     var correlations = list;
     return correlations;
   });
   return query;
}
}




module.exports = {
    getCorrelations,
};
