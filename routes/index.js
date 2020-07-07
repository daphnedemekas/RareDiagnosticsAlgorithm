var express = require('express');
var router = express.Router();
var db = require('../controllers/DatabaseConnection')
var bayesian = require('../Algorithms/BayesianAlgorithm/bayesian');
// var articlescraper = require('../Testing/article_scraper');

var Algorithm =  require('../controllers/Algorithm')

// Initialize each algorithm
let bayesian_algorithm = new Algorithm("Bayesian Algorithm", bayesian.likelihoodCalculator);

//IMPORTANT: This is where we register our algorithms
let test_algorithms = [bayesian_algorithm];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Algorithm Test Platform', symptoms: "", test_disease:"" });
});

router.post('/testsearch',async function(req,res,next){
  var disease_orpha = req.body.disease_number
  var symptoms = req.body.symptoms.split(",");

  //Quickly sanitize input: get rid of spaces.
  //TODO: Make all lowercase and figure out how to make this work with algorithm.
  symptoms = symptoms.map(symptom => {return symptom.trim()})

  //This runs each algorithm and waits for all of them to be done.
  Promise.all(test_algorithms.map(alg => alg.rank(symptoms)))
  .then(async function(results){
    var test_data = {test_units:[]};

    if (disease_orpha){
      const test_disease = await db.Disease.findByPk(disease_orpha);
      test_data.test_disease = test_disease.toJSON()
    }

    for (var i=0; i < results.length; i++){

      //Flatten the data and make it JSON
      var pre_data = results[i].map((obj) => {
        return {score: obj.score, ...obj.disease.toJSON(), is_tested: (obj.disease.orpha_number == disease_orpha)?true:false}
      })

      //Sort the data
      pre_data = pre_data.sort((a,b) => {return b.score - a.score}).slice(0,10);

      test_data.test_units.push({
        from_algorithm: test_algorithms[i].name,
        matched_diseases: pre_data
      })
    }

    res.render('results',{
      title: 'Search Results',
      symptoms: req.body.symptoms,
      ...test_data,
    });
  })
})

//This route is the one which is hit by a POST request for the search.
//Expected POST Input:
//Optional: symptoms: List of symptoms, separated by a comma: "Pain,Fever,etc..."
//Optional: disease_number: OrphaNet ID of disease which we know we are testing against.
// router.post('/search',function(req,res,next){
//   disease_orpha = req.body.disease_number
//   var symptoms = req.body.symptoms.split(",");
//
//   //Quickly sanitize input: get rid of spaces.
//   //TODO: Make all lowercase and figure out how to make this work with algorithm.
//   symptoms = symptoms.map(symptom => {return symptom.trim()})
//
//   //We perform the Bayesian test against this data. Bayesian test returns a list of the
//   //top 10 disease names which matched as an array (ordered by rank).
//   bayesian.bayesianTest(symptoms,function(disease_list){
//     //If we are provided a test disease, pull the information associated with it.
//     if (disease_orpha){
//       let query = "SELECT Disease.disease_name, Symptom.symptom_name FROM Correlation INNER JOIN Disease ON Correlation.disease_orpha=Disease.orpha_number INNER JOIN Symptom ON Correlation.symptom_id = Symptom.id WHERE disease_orpha="+disease_orpha;
//       database.query(query, (err,rows)=>{
//         if (err){
//           res.redirect('/')
//         }
//         else{
//           //If there is no match for an OrphaNet Number.
//           if (rows.length < 1){
//             res.render('results',{title: 'Algorithm Test Platform', symptoms: req.body.symptoms, diseases: disease_list, test_disease_name:"NO MATCH", test_disease_symptoms:""});
//           }
//
//           //Otherwise the OrphaNet ID provided is valid and we have results.
//           else{
//             var test_disease_symptoms = [];
//             for (let symptom of rows){
//               test_disease_symptoms.push(symptom.symptom_name);
//             }
//             res.render('results',
//             {
//               title: 'Search Results',
//               symptoms: req.body.symptoms,
//               diseases: disease_list,
//               test_disease_name:rows[0].disease_name,
//               test_disease_symptoms: test_disease_symptoms
//             });
//           }
//         }
//       })
//     }
//
//     //If there is no test disease, just the search results.
//     else{
//       res.render('results',{
//         title: 'Search Results',
//         symptoms: req.body.symptoms,
//         diseases: disease_list,
//         test_disease:""});
//     }
//   })
// })

// router.post('/cureus-search', function(req,res,next){
//     let cureus_url = req.body.cureus_url
//     disease_orpha = req.body.disease_number
//     var scraper = new articlescraper.Scraper(cureus_url);
//     scraper.scrape(function(error,data){
//       if(error){throw error}
//       let return_symptoms = []
//       articlescraper.getSymptomsList(database, q, getdata_controller).then(function(query) {
//         let symptoms = query;
//         for (var symptom of symptoms){
//           if (data.toLowerCase().includes(symptom[2].toLowerCase())) {
//             return_symptoms.push(symptom[2]);
//           }
//         }
//
//         bayesian.bayesianTest(return_symptoms,function(disease_list){
//           //If we are provided a test disease, pull the information associated with it.
//           if (disease_orpha){
//             let query = "SELECT Disease.disease_name, Symptom.symptom_name FROM Correlation INNER JOIN Disease ON Correlation.disease_orpha=Disease.orpha_number INNER JOIN Symptom ON Correlation.symptom_id = Symptom.id WHERE disease_orpha="+disease_orpha;
//             database.query(query, (err,rows)=>{
//               if (err){
//                 res.redirect('/')
//               }
//               else{
//                 //If there is no match for an OrphaNet Number.
//                 if (rows.length < 1){
//                   res.render('results',{title: 'Algorithm Test Platform', symptoms: return_symptoms, diseases: disease_list, test_disease_name:"NO MATCH", test_disease_symptoms:""});
//                 }
//
//                 //Otherwise the OrphaNet ID provided is valid and we have results.
//                 else{
//                   var test_disease_symptoms = [];
//                   for (let symptom of rows){
//                     test_disease_symptoms.push(symptom.symptom_name);
//                   }
//                   res.render('results',
//                   {
//                     title: 'Search Results',
//                     symptoms: return_symptoms,
//                     diseases: disease_list,
//                     test_disease_name:rows[0].disease_name,
//                     test_disease_symptoms: test_disease_symptoms
//                   });
//                 }
//               }
//             })
//           }
//
//           //If there is no test disease, just the search results.
//           else{
//             res.render('results',{
//               title: 'Search Results',
//               symptoms: req.body.symptoms,
//               diseases: disease_list,
//               test_disease:""});
//           }
//         })
//
//       })
//     })
//
// })
module.exports = router;
