//Scrap data from a (collection of) Cureus articles and save to TestCases
var cheerio = require('cheerio');
var request = require('request');
var urlParser = require('url');

const {Symptom,Disease,TestCase} = require('../controllers/DatabaseConnection')

async function treatCureusArticle(string_url, disease_orpha) {

  //Parse the URL to sanitize.
  let url = urlParser.parse(string_url)
  let disease = await Disease.findByPk(disease_orpha)

  if (!disease) {
    console.log("Uknown OrphaID given for "+string_url)
    throw "Uknown disease OrphaID."
  }

  if (url.hostname) {
    var symptoms = await Symptom.findAll({include: Disease})
    console.log("Initiating network request for "+string_url)
    request({uri: url, jar: true, headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'}}, async function (error, response, data) {
        if (!error) {
          console.log("Received network response for article: " + string_url)
          var candidate_symptoms = []
          var $ = cheerio.load(data);
          var article = $("div.article-content-body:nth-child(4)");
          var casepresentation = article.text();

          for(let symptom of symptoms){
            if (symptom.symptom_name == 'All'){continue}
            if (casepresentation.toLowerCase().includes(symptom.symptom_name.toLowerCase())){
              candidate_symptoms.push(symptom)
            }
          }

          // Now we have an array of potential symptoms. We now have to eliminate
          // symptoms which are not right
          var final_symptoms = []
          for (var symptom of candidate_symptoms) {
            var disease_list_count = await symptom.countDiseases()
            if (disease_list_count > 0){final_symptoms.push(symptom); continue}
            else {
              let parent_symptoms = await symptom.getParents()
              for (let parent_symptom of parent_symptoms) {
                var parent_disease_list_count = await parent_symptom.countDiseases()
                if (parent_disease_list_count > 0){final_symptoms.push(symptom); break}
              }
            }
          }

          //Finally create test case article.
          console.log(string_url)
          const new_cureus = await TestCase.create({
            origin: "Cureus",
            origin_url: "Kukuhhhhh",
            disease_orpha: disease_orpha,
            symptoms_list: final_symptoms.map(symptom => symptom.symptom_name).join(', ')
          })

          new_cureus.addSymptoms(final_symptoms)
          new_cureus.setDisease(disease)
        }
        else {
            console.log(error);
            throw error
        }
    });
  }
}

treatCureusArticle("https://www.cureus.com/articles/31800-adult-onset-stills-disease-typical-presentation-delayed-diagnosis","829");
