var express = require('express');
var router = express.Router();
const db = require('../database/dbconfig.js');

router.get('/list' , (req , res) => {
    db.getConnection((err, connection) =>{
    if (err) throw err
        //console.log('connected as id  ',connection.threadId)
        let qry = 'select * from company c,branch b where c.company_id=b.company_id'
        let Js = {}
       // let qry = 'SELECT * FROM company'
        connection.query(qry ,(err,rec) => {
        //connection.release()
        if (!err){
          res.json(rec)
         // for (let row of rec.rows)
          //{
            
         // }
        }else{
          res.send(err).status(400)
        }
    })
    })
})

  module.exports = router;