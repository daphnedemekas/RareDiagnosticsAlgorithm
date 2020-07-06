var express = require('express');
var router = express.Router();
var queries = require('../Algorithm/queries');
var q = require('q');
var database = require('../Algorithm/db_connection')
var getdata_controller = require('../Algorithm/getData');
var bayesionmodel = require('../Algorithm/bayesionmodel');
var articlescraper = require('../Testing/article_scraper');
var Algorithm =  require('../controllers/Algorithm')

// Initialize each algorithm
let bayesian_algorithm = new Algorithm("Bayesian Algorithm", bayesionmodel.bayesianAlgorithm);
let other_algorithm = new Algorithm("Other Algorithm", bayesionmodel.bayesianAlgorithm)

//IMPORTANT: This is where we register our algorithms
let test_algorithms = [bayesian_algorithm, other_algorithm];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Algorithm Test Platform', symptoms: "", test_disease:"" });
});

router.post('/testsearch',function(req,res,next){
  disease_orpha = req.body.disease_number
  var symptoms = req.body.symptoms.split(",");

  //Quickly sanitize input: get rid of spaces.
  //TODO: Make all lowercase and figure out how to make this work with algorithm.
  symptoms = symptoms.map(symptom => {return symptom.trim()})

  //This runs each algorithm and waits for all of them to be done. 
  Promise.all([bayesian_algorithm.rank(symptoms), other_algorithm.rank(symptoms)])
  .then(results => {
    console.log(results);
    var test_data = {test_units:[]};
    for (var i=0; i < results.length; i++){
      test_data.test_units.push({
        from_algorithm: test_algorithms[i].name,
        matched_diseases: results[i]
      })
    }
    console.log(test_data)
    res.render('results',{
      title: 'Search Results',
      symptoms: req.body.symptoms,
      ...test_data,
    });
  })
})

  // bayesian_algorithm.rank(symptoms).then(disease_list => {
  //   res.render('results',{
  //     title: 'Search Results',
  //     symptoms: req.body.symptoms,
  //     diseases: disease_list,
  //     test_disease:""});
  // })

//This route is the one which is hit by a POST request for the search.
//Expected POST Input:
//Optional: symptoms: List of symptoms, separated by a comma: "Pain,Fever,etc..."
//Optional: disease_number: OrphaNet ID of disease which we know we are testing against.
router.post('/search',function(req,res,next){
  disease_orpha = req.body.disease_number
  var symptoms = req.body.symptoms.split(",");

  //Quickly sanitize input: get rid of spaces.
  //TODO: Make all lowercase and figure out how to make this work with algorithm.
  symptoms = symptoms.map(symptom => {return symptom.trim()})

  //We perform the Bayesian test against this data. Bayesian test returns a list of the
  //top 10 disease names which matched as an array (ordered by rank).
  bayesionmodel.bayesianTest(symptoms,function(disease_list){
    //If we are provided a test disease, pull the information associated with it.
    if (disease_orpha){
      let query = "SELECT Disease.disease_name, Symptom.symptom_name FROM Correlation INNER JOIN Disease ON Correlation.disease_orpha=Disease.orpha_number INNER JOIN Symptom ON Correlation.symptom_id = Symptom.id WHERE disease_orpha="+disease_orpha;
      database.query(query, (err,rows)=>{
        if (err){
          res.redirect('/')
        }
        else{
          //If there is no match for an OrphaNet Number.
          if (rows.length < 1){
            res.render('results',{title: 'Algorithm Test Platform', symptoms: req.body.symptoms, diseases: disease_list, test_disease_name:"NO MATCH", test_disease_symptoms:""});
          }

          //Otherwise the OrphaNet ID provided is valid and we have results.
          else{
            var test_disease_symptoms = [];
            for (let symptom of rows){
              test_disease_symptoms.push(symptom.symptom_name);
            }
            res.render('results',
            {
              title: 'Search Results',
              symptoms: req.body.symptoms,
              diseases: disease_list,
              test_disease_name:rows[0].disease_name,
              test_disease_symptoms: test_disease_symptoms
            });
          }
        }
      })
    }

    //If there is no test disease, just the search results.
    else{
      res.render('results',{
        title: 'Search Results',
        symptoms: req.body.symptoms,
        diseases: disease_list,
        test_disease:""});
    }
  })
})

router.post('/cureus-search', function(req,res,next){
    let cureus_url = req.body.cureus_url
    disease_orpha = req.body.disease_number
    var scraper = new articlescraper.Scraper(cureus_url);
    scraper.scrape(function(error,data){
      if(error){throw error}
      let return_symptoms = []
      articlescraper.getSymptomsList(database, q, getdata_controller).then(function(query) {
        let symptoms = query;
        for (var symptom of symptoms){
          if (data.toLowerCase().includes(symptom[2].toLowerCase())) {
            return_symptoms.push(symptom[2]);
          }
        }

        bayesionmodel.bayesianTest(return_symptoms,function(disease_list){
          //If we are provided a test disease, pull the information associated with it.
          if (disease_orpha){
            let query = "SELECT Disease.disease_name, Symptom.symptom_name FROM Correlation INNER JOIN Disease ON Correlation.disease_orpha=Disease.orpha_number INNER JOIN Symptom ON Correlation.symptom_id = Symptom.id WHERE disease_orpha="+disease_orpha;
            database.query(query, (err,rows)=>{
              if (err){
                res.redirect('/')
              }
              else{
                //If there is no match for an OrphaNet Number.
                if (rows.length < 1){
                  res.render('results',{title: 'Algorithm Test Platform', symptoms: return_symptoms, diseases: disease_list, test_disease_name:"NO MATCH", test_disease_symptoms:""});
                }

                //Otherwise the OrphaNet ID provided is valid and we have results.
                else{
                  var test_disease_symptoms = [];
                  for (let symptom of rows){
                    test_disease_symptoms.push(symptom.symptom_name);
                  }
                  res.render('results',
                  {
                    title: 'Search Results',
                    symptoms: return_symptoms,
                    diseases: disease_list,
                    test_disease_name:rows[0].disease_name,
                    test_disease_symptoms: test_disease_symptoms
                  });
                }
              }
            })
          }

          //If there is no test disease, just the search results.
          else{
            res.render('results',{
              title: 'Search Results',
              symptoms: req.body.symptoms,
              diseases: disease_list,
              test_disease:""});
          }
        })

      })
    })

})
module.exports = router;
