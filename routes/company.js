var express = require('express');
var router = express.Router();
const db = require('../database/dbconfig.js');

router.get('/list' , (req , res) => {
    db.getConnection((err, connection) =>{
    if (err) throw err
        //console.log('connected as id  ',connection.threadId)
        let qry = 'select c.company_id,b.branch_id from company c,branch b where c.company_id=b.company_id'
       // let qry = 'SELECT * FROM company'
        connection.query(qry ,(err,rows) => {
        connection.release()
        if (!err){
          if (rows > 0){
          res.json(rows)
          }else{
            res.json(
              "There is no table"
            )
          }
        }else{
          res.send(err)
        }
    })
    })
})

  module.exports = router;