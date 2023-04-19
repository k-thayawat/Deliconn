var express = require("express");
var router = express.Router();
const db = require("../database/dbconfig.js");
//faisfn
router.get("/list", (req, res) => {
  db.getConnection((err, connection) => {
    if (err) throw err;
    //console.log('connected as id  ',connection.threadId)
    let qry =
      "select * from company c,branch b where c.company_id=b.company_id";
    let branch = {};
    let Obb = [];
    // let qry = 'SELECT * FROM company'
    connection.query(qry, (err, rec) => {
      //connection.release()
      if (!err) {
        const len = Object.keys(rec).length;
        for (let i = 0; i < len; i++) {
          //Reset value
          branch = {};
          branch = {
            branchid: rec[i].branch_id,
            code: rec[i].branch_code,
            name: rec[i].branch_name,
            housenumber: rec[i].house_number,
            address1: rec[i].address1,
            subdistrict: rec[i].sub_district,
            district: rec[i].district,
            province: rec[i].province,
            zipcode: rec[i].zipcode,
            country: rec[i].country,
            language: rec[i].remark,
            remark: rec[i].actived_flag,
          };
          Obb.push(branch);
        }
        res.json({
          company: rec[0].company_id,
          taxid: rec[0].taxid,
          title: rec[0].title,
          name1: rec[0].name1,
          name2: rec[0].name2,
          shortname: rec[0].shortname,
          active: rec[0].actived_flag,
          branch: Obb,
          insertdate: rec[0].update_date,
          insertby: rec[0].update_by,
        });
      } else {
        res.json(err).status(400);
      }
    });
  });
});

module.exports = router;
