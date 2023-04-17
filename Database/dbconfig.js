// get the client
const mysql = require('mysql');

// create the connection to database
const connection = mysql.createPool({
  connectionLimit : 10,
  host: 'localhost',
  user: 'root',
  database: 'deliconn',
  port : '3500'
});

module.exports = connection;