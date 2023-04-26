// get the client
const mysql = require('mysql');

// create the connection to database
const connection = mysql.createPool({
  connectionLimit : 10,
  host: 'db4free.net',
  user: 'malice',
  password : 'malice12',
  database: 'kanja_db'
});

module.exports = connection;