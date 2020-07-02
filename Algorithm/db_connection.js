var mysql = require('mysql');

if (process.env.NODE_ENV != 'prod') {
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
