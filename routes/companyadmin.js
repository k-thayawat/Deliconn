var express = require("express");
var router = express.Router();
const db = require("../database/dbconfig.js");
const { DATETIME } = require("mysql/lib/protocol/constants/types.js");

//Get Company
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

//Insert new Company
router.post("/new", (req, res) => {
  let arr = [];
  let errmsg = {};
  if (!req.body.taxid) {
    errmsg.message = "taxid is required";
    arr.push(errmsg);
  }
  if (!req.body.name1) {
    errmsg.message = "name1 is required";
    arr.push(errmsg);
  }

  db.getConnection((err, connection) => {
    if (err) throw err;
    let qry =
    `INSERT INTO company (taxid, title, name1, name2, shortname, actived_flag, insert_date, insert_by) VALUES ('${req.body.taxid}', '${req.body.title}', '${req.body.name1}', '${req.body.name2}', '${req.body.shortname}', '${req.body.active}','${req.body.insertdate}','${req.body.insertby}')`
     for (let i = 0; i < req.body.branch.length(); i++) {
       `INSERT INTO branch (company_taxid, branch_code, branch_name, house_number, address1, sub_district, district, province, zipcode, country, language, remark) VALUES (${req.body.taxid},${req.body.branch[i].code}, ${req.body.branch[i].name}, ${req.body.branch[i].housenumber}, ${req.body.branch[i].address1}, ${req.body.branch[i].subdistrict}, ${req.body.branch[i].district}, ${req.body.branch[i].province}, ${req.body.branch[i].zipcode}, ${req.body.branch[i].country}, ${req.body.branch[i].language}, ${req.body.branch[i].remark})`
     }
    connection.query(qry, (err, rows) => {
      //connection.release()
      if (!err) {
        res.json({
          message : 'Company record inserted successfully',
          status : 200
        })
      } else {
        res.send(err).status(400);
      }
    });
  });
});

//Update existing company
router.put("/update", (req, res) => {
  db.getConnection((err, connection) => {
    if (err) throw err;
    //console.log('connected as id  ',connection.threadId)
    let qry =
      "select * from company c,branch b where c.company_id=b.company_id";
    // let qry = 'SELECT * FROM company'
    connection.query(qry, (err, rows) => {
      //connection.release()
      if (!err) {
        res.json(rows);
      } else {
        res.send(err).status(400);
      }
    });
  });
});

module.exports = router;
