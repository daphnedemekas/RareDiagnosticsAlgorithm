# RareDiagnosticsAlgorithm
## The environment variables
Before running the application, make sure you have got the proper environment variables set. Either set them manually on your environment, or create (or edit)
the file `.env` in the root directory. For example the following is my `.env` file. 

    NODE_ENV=development
    SQL_HOST=localhost
    SQL_USER=axel
    SQL_PASSWORD=pass
    SQL_DB=RareDiagnostics 

The `.env` file is especially practical for us to go from machine to machine, etc... Note however that **in production environment or in the AWS Cloud, this file
will not be read and the environment variables need to be set in the EC2 (or ElasticBeanstalk in our case) instance's configuration.** See for example [this link](https://alexdisler.com/2016/03/26/nodejs-environment-variables-elastic-beanstalk-aws/#:~:text=Elastic%20Beanstalk%20lets%20you%20enter,of%20properties%20you%20can%20configure.)
for examples on how to this. The application expect an additional `IS_AWS` environment variable (which is true or false), which tells us if it is running on the AWS cloud.
This variable is currently set in the existing instances, but don't forget to set it if you create new instances to run this application. 

## Database Interaction 
We are currently using Sequelize v6 to interact with MariaDB. The [documentation](https://sequelize.org/master/index.html) is very complete. The Core Concepts are all relevant. To get started, the most relevant section of the Docs is probably Model Querying - Finders. Understanding the Associations section is important, how to perform Lazy vs. Eager loading. 
The center of database interaction in the project is in the file `controllers/DatabaseConnection.js`. Currently the `testConnection` function in that file contains some examples which are commented out. For other places to see how to use Sequelize in the project, check out the file `Algorithms/BayesianAlgorithm/bayesian.js`

### Flattening an object to JSON
Before passing our database objects to a view, it is best (possibly even necessary) to turn them into JSON. When debugging, it also useful to turn the objects to JSON to see what the data. See the following snippet
    
    var db = require('controllers/DatabaseConnection')
    var symptom = db.Symptom.findByPk('HP:0002077')
    
    //Bad for display!
    console.log(symptom)
    
    //Good for display and passing to view
    console.log(symptom.toJSON())
    
## Adding an Algorithm 
Adding an algorithm has never been easier! The `Algorithm` class takes the name of an algorithm and a ranking function. See for example the top of the `index.js` file in `routes/`:

    var bayesian = require('../Algorithms/BayesianAlgorithm/bayesian');
    var Algorithm =  require('../controllers/Algorithm')
    let bayesian_algorithm = new Algorithm("Bayesian Algorithm", bayesian.likelihoodCalculator);
  
The next step is to simply 'register' the algorithm: 

    let test_algorithms = [bayesian_algorithm]; //Add other Algorithms to this array.

The only thing to be careful about is the ranking function: it must take as input a list of symptom names, and return a Promise which will handle an array of 
objects of the form `[{score: Float, disease: Disease}]`. This is also mentioned in the `controllers/Algorithm` algorithm file. To see what the rank function returns (concretely), try playing around with the file `Algorithms/BayesianAlgorithm/bayesiantest.js`.
