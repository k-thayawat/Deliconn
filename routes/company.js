var express = require("express");
var router = express.Router();
const db = require("../Database/dbconfig.js");

router.get("/", (req, res) => {
  res.status(200).send(`Change path to companyadmin`)
});

module.exports = router;
