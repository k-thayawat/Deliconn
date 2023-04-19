var express = require('express');
var router = express.Router();
const db = require('../database/dbconfig.js');

router.post('/new' , (req , res) => {
    db.getConnection((err, connection) =>{
    if (err) throw err
        let qry = 'select * from company c,branch b where c.company_id=b.company_id'
       // let qry = 'SELECT * FROM company'
        connection.query(qry ,(err,rows) => {
        //connection.release()
        if (!err){
          res.json(rows)
        }else{
          res.send(err).status(400)
        }
    })
    })
})

router.put('/update' , (req , res) => {
    db.getConnection((err, connection) =>{
    if (err) throw err
        //console.log('connected as id  ',connection.threadId)
        let qry = 'select * from company c,branch b where c.company_id=b.company_id'
       // let qry = 'SELECT * FROM company'
        connection.query(qry ,(err,rows) => {
        //connection.release()
        if (!err){
          res.json(rows)
        }else{
          res.send(err).status(400)
        }
    })
    })
})
  module.exports = router;