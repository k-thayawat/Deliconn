var express = require('express');
var router = express.Router();
const db = require('../database/dbconfig.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



router.post('/register', (req,res,next) => {
  if (req.body != ''){
    res.json({
      'message' : 'success'
    })
  }else{
    res.send('No content')
  }
})

module.exports = router;
