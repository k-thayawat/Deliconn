var express = require('express');
var router = express.Router();
const db = require('../database/dbconfig.js')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/companylist' , (req , res) => {
  db.getConnection((err, connection) =>{
    if (err) throw err
    console.log('connected as id  ',connection.threadId)
  
    connection.query('SELECT * from company' ,(err,rows) => {
      connection.release()
      if (!err){
        res.json(rows)
      }else{
        res.send(err)
      }
    })
  })
  
})

router.post('/register', (req,res,next) => {
  if (req.body != ''){
    res.json({
      'message' : 'success'
    })
  }
})

module.exports = router;
