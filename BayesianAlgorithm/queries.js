
async function getCorrelations(db, q, getData) {
  var query = await getData.makeQuery(db, q, "SELECT * FROM Correlation", "disease_orpha", "symptom_id", "frequency")
   .then(function(rows)  {
     var correlations = list;
     return correlations;
   });
   return query;
}

async function getDiseases(db, q, getData) {
  var map = new Map();
  var query = await getData.makeQuery(db, q, "SELECT * FROM Disease", "orpha_number", "type", "disease_name")
   .then(function(rows)  {
     var diseases = list;
     for (i of diseases) { map.set(i[0],i[2])};
     return map;
   });
   return query;
}

async function getSymptoms(db, q, getData) {

  var map = new Map();
  var query = await getData.makeQuery(db, q, "SELECT * FROM Symptom", "id", "definition", "symptom_name")
   .then(function(rows)  {
     var symptoms = list;
     for (i of symptoms) { map.set(i[2], i[0]); map.set(i[0],i[2])};
     return map;
   });
   return query;
}

async function getInheritance(db, q, getData) {
  var query = await getData.makeQuery(db, q, "SELECT * FROM SymptomInheritance", "superclass_id", "subclass_id")
   .then(function(rows)  {
     var inheritance = list;
     return inheritance;

   });
   return query;
}


module.exports = {
    getCorrelations,
    getInheritance,
    getDiseases,
    getSymptoms
};
