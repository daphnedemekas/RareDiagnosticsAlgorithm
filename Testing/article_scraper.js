var cheerio = require('cheerio');
var request = require('request');
// var read = require('node-readability');
var urlParser = require('url');
var queries = require('../Algorithm/queries');
var q = require('q');
var database = require('../Algorithm/db_connection')
var getdata_controller = require('../Algorithm/getData');

//Very specific scraper, but the code is flexible. Load the 'Case Presentation' section
//of a Cureus article.
var Scraper = function(url){
  this.url = urlParser.parse(url);
}

async function getSymptomsList(database, q, getdata_controller) {
  var query = await getdata_controller.makeQuery(database, q, "SELECT * FROM Symptom", "id", "definition", "symptom_name")
   .then(function(rows)  {
     var symptoms = list;
     return symptoms;
   });
   return query;
}

Scraper.prototype.scrape = function(callback){
  if (this.url.hostname) { //The URL has a valid hostname
    request({uri: this.url, jar: true, headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'}}, function (error, response, data) {
        if (!error) {
          var $ = cheerio.load(data);
          var article = $("div.article-content-body:nth-child(4)");
          var casepresentation = article.text();
          callback(null,casepresentation);
        }
        else {
            console.log(error);
            callback(error,null);
        }
    });
  }
}

var scraper = new Scraper("https://www.cureus.com/articles/31800-adult-onset-stills-disease-typical-presentation-delayed-diagnosis");
scraper.scrape(function(error,data){
  let returnsymptoms = []
  getSymptomsList(database, q, getdata_controller).then(function(query) {
    let symptoms = query;
    for (var symptom of symptoms){
      if (data.toLowerCase().includes(symptom[2].toLowerCase())) {
        returnsymptoms.push(symptom[2]);
      }
    }
    console.log(returnsymptoms)
  })
})

module.exports = {Scraper,getSymptomsList}
