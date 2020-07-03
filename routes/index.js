var express = require('express');
var router = express.Router();
var queries = require('../Algorithm/queries');
var q = require('q');
var database = require('../Algorithm/db_connection')
var getdata_controller = require('../Algorithm/getData');
var bayesionmodel = require('../Algorithm/bayesionmodel')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Algorithm Test Platform', symptoms: "", test_disease:"" });
   // return query;
});

async function pullTestDiseaseCorrelation(disease_number){
  var query = await getdata_controller.makeQuery(database, q, 'SELECT * FROM Correlation WHERE disease_orpha="'+test_disease+'"', "disease_orpha", "symptom_id", "frequency")
   .then(function(rows)  {
     console.log(list)
     return list;
   });
   return query
}

//Takes a list of OrphaNet symptom IDs
//Returns populated array for these symptoms
async function pullSymptomList(symptom_list){
  var search_string = "("
  for (var i =0; i < symptom_list.length; i++){
    let symptom = symptom_list[i]
    if(i < symptom_list.length - 1){
      search_string = search_string + "'"+symptom+"',"
    }
    else{
      search_string = search_string + "'"+symptom+"'"
    }
  }

  search_string = search_string + ")"
  console.log(search_string)
  var query = await getdata_controller.makeQuery(database,q, 'SELECT * FROM Symptom WHERE id IN '+search_string, "id", "definition", "symptom_name").then(function(rows){
    return list
  })

  return query
}

function pullTestDiseaseSymptoms(disease_number,callback){
  pullTestDiseaseCorrelation(disease_number).then(function(correlation){
    var symptom_list = []
    for(var i=0; i < correlation.length; i++){
      symptom_list.push(correlation[i][1])
    }
    return pullSymptomList(symptom_list)
  })
}

router.post('/', function(req,res,next) {
  console.log(req.body)
  test_disease = req.body.disease_number
  var symptoms = req.body.symptoms.split(",");
  bayesionmodel.bayesianTest(symptoms,function(disease_list){
    if (test_disease){
      pullTestDiseaseCorrelation(test_disease).then(function(correlation){
        var symptom_list = []
        for(var i=0; i < correlation.length; i++){
          symptom_list.push(correlation[i][1])
        }
        pullSymptomList(symptom_list).then(function(list){
          symptom_names = []
          for(var i=0; i < list.length; i++){
            symptom_names.push(list[i][2])
          }
          res.render('index',{title: 'Algorithm Test Platform', symptoms: req.body.symptoms, diseases: disease_list, test_disease: symptom_names});
        })
      })
    }
    else{
      res.render('index',{title: 'Algorithm Test Platform', symptoms: req.body.symptoms, diseases: disease_list, test_disease:""});
    }

  })
})
module.exports = router;
