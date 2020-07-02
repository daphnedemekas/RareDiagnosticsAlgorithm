var mysql = require('mysql');

var connection = mysql.createConnection({
  host: "localhost",
  user: "axel",
  password: "pass",
  database: "RareDiagnostics",
  connectionLimit: 5
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;
