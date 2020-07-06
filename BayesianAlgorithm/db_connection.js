var mysql = require('mysql');

//Check that we are not in production environment or in the AWS cloud.
//In these cases, the environment variables should be set on the machine
if (process.env.NODE_ENV != 'prod' && !process.env.IS_AWS) {
  require('dotenv').config();
}

var connection = mysql.createConnection({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: "RareDiagnostics",
  connectionLimit: 5
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;
