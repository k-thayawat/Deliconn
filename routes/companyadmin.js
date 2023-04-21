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
      "select * from company c left outer join branch b on (c.company_id=b.company_id)";
    let company = {};
    let branch = {};
    let Obb = [];
    let ComRec = [];
    // let qry = 'SELECT * FROM company'
    connection.query(qry, (err, rec) => {
      //connection.release()
      if (!err) {
        const len = Object.keys(rec).length;
        let companybuffer = "";
        for (let i = 0; i < len; i++) {
          //Same Company
          if (rec[i].taxid != companybuffer){
            Obb = [];
            company = {};
            companybuffer = rec[i].taxid
            company = {
              company: rec[i].company_id,
              taxid: rec[i].taxid,
              title: rec[i].title,
              name1: rec[i].name1,
              name2: rec[i].name2,
              shortname: rec[i].shortname,
              active: rec[i].actived_flag,
              branch: Obb,
              insertdate: rec[i].update_date,
              insertby: rec[i].update_by,
            }
            ComRec.push(company)
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
            }
            Obb.push(branch);
          }else{
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
            }
            Obb.push(branch);
          }
        }
        res.json({
          companylist:ComRec
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
  let IsError = false;
  if (!req.body.taxid) {
    errmsg.message = "taxid is required";
    arr.push(errmsg);
    errmsg = {};
    IsError = true
  }
  if (!req.body.name1) {
    errmsg.message = "name1 is required";
    arr.push(errmsg);
    IsError = true
  }
  if (!IsError){
    db.getConnection((err, connection) => {
      if (err){
        arr.push(err)
        res.json({
          Errcode : res.status,
          Errstatus: arr
        })
      }else{
        connection.beginTransaction((err) => {
          if (err){
            arr.push(err)
            res.json({
              Errcode : res.status,
              Errstatus:[arr]
            })
          }else{
            let qry = `INSERT INTO company (taxid, title, name1, name2, shortname, actived_flag, insert_date, insert_by)  VALUES ('${req.body.taxid}', '${req.body.title}', '${req.body.name1}', '${req.body.name2}', '${req.body.shortname}', '${req.body.active}','${req.body.insertdate}','${req.body.insertby}')`
            connection.query((err,rec) => {
              if (err){
                arr.push(err)
                res.json({
                  Errcode : res.status,
                  Errstatus:[arr]
                })
              }else{
                connection.commit((err)=>{
                  for (let i = 0; i < req.body.branch.length(); i++) {
                    qry =  `INSERT INTO branch (company_taxid, branch_code, branch_name, house_number, address1, sub_district, district, province, zipcode, country, language, remark) VALUES (${req.body.taxid},${req.body.branch[i].code}, ${req.body.branch[i].name}, ${req.body.branch[i].housenumber}, ${req.body.branch[i].address1}, ${req.body.branch[i].subdistrict}, ${req.body.branch[i].district}, ${req.body.branch[i].province}, ${req.body.branch[i].zipcode}, ${req.body.branch[i].country}, ${req.body.branch[i].language}, ${req.body.branch[i].remark})`
                    connection.query(qry ,(err,rec) => {
                      if (err){
                        connection.rollback(() => {
                         connection.release();
                          arr.push(err)
                          res.json({
                            Errcode : res.status,
                            Errstatus:[arr]
                          }) 
                        });
                      }else{
                        con.commit(function(err, rs) {
                          if(err){
                            connection.release(() => {
                             res.json({
                                ErrorCode: res.status(200),
                                ErrStatus : 'Successfully Inserted'
                              })
                            })
                          }
                       })
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    })
  }else{
    res.status(400).json({
      errorcode:400,
      errmsg:arr
    })
  }
})


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
