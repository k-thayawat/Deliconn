const db = require('mysql2')

const Database = db.createPool({
    host:'localhost',
    user:'root',
    database:'deliconn',
    password:'root',
    port: 3000
})

module.exports = Database.promise();    