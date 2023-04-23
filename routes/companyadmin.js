var express = require("express");
var router = express.Router();
const db = require("../Database/dbconfig.js");
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
          if (rec[i].taxid != companybuffer) {
            Obb = [];
            company = {};
            companybuffer = rec[i].taxid;
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
            };
            ComRec.push(company);
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
          } else {
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
        }
        res.json({
          companylist: ComRec,
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
  //Check data
  if (!req.body.taxid) {
    errmsg.message = "taxid is required";
    arr.push(errmsg);
    errmsg = {};
    IsError = true;
  }
  if (!req.body.name1) {
    errmsg.message = "name1 is required";
    arr.push(errmsg);
    errmsg = {};
    IsError = true;
  }
  if (!req.body.shortname) {
    errmsg.message = "shortname is required";
    arr.push(errmsg);
    errmsg = {};
    IsError = true;
  }
  if (!req.body.insertdate) {
    var insertdate = new Date();
  } else {
    insertdate = req.body.insertdate;
  }
  // if (!req.body.language) {
  //   errmsg.message = "language is required";
  //   arr.push(errmsg);
  //   errmsg = {};
  //   IsError = true;
  // }
  //end check
  if (!IsError) {
    db.getConnection((err, connection) => {
      if (err) {
        arr.push(err);
        res.status(500).json({
          Errcode: 500,
          Errstatus: arr,
        });
      } else {
        connection.beginTransaction((err) => {
          if (err) {
            arr.push(err);
            res.json({
              Errcode: 500,
              Errstatus: arr,
            });
          } else {
            qry =
              "INSERT INTO company (company_id ,taxid, title, name1, shortname, actived_flag, language, insert_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            params = [
              req.body.company_id,
              req.body.taxid,
              req.body.title,
              req.body.name1,
              req.body.shortname,
              req.body.active,
              req.body.language,
              insertdate,
            ];

            connection.query(qry, params, (err, record) => {
              if (err) {
                connection.rollback();
                arr.push(err.message);
                res.status(400).json({
                  Errcode: 400,
                  Errstatus: arr,
                });
              } else {
                if (req.body.branch) {
                  console.log(req.body);
                  for (let i = 0; i < req.body.branch.length; i++) {
                    let qrybranch =
                      "INSERT INTO branch (company_id , branch_code, branch_name, house_number, address1, sub_district, district, province, zipcode, country, language, remark) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    let branchpr = [
                      req.body.company_id,
                      req.body.branch[i].code,
                      req.body.branch[i].name,
                      req.body.branch[i].housenumber,
                      req.body.branch[i].address1,
                      req.body.branch[i].subdistrict,
                      req.body.branch[i].district,
                      req.body.branch[i].province,
                      req.body.branch[i].zipcode,
                      req.body.branch[i].country,
                      req.body.branch[i].language,
                      req.body.branch[i].remark,
                    ];
                    connection.query(qrybranch, branchpr, (err, recb) => {
                      if (err) {
                        connection.rollback(() => {
                          connection.release();
                          arr.push(err);
                          res.json({
                            Errcode: 400,
                            Errstatus: arr,
                          });
                        });
                      } else {
                        connection.commit(function (err, rs) {
                          if (err) {
                            connection.release(() => {
                              res.json({
                                ErrorCode: 400,
                                ErrStatus: err,
                              });
                            });
                          }
                          res.status(201).json({
                            ErrorCode: 201,
                            ErrStatus: rs,
                          });
                          connection.release();
                        });
                      }
                    });
                  }
                  //no branch
                } else {
                  connection.commit((err, rs) => {
                    if (err) {
                      res.json({
                        ErrorCode: 200,
                        ErrStatus: "Successfully Inserted",
                      });
                    } else {
                      res.status(200).json({
                        errorcode: 200,
                        errmsg: "insert success",
                      });
                    }
                    connection.release();
                  });
                }
              }
            });
          }
        });
      }
    });
  } else {
    res.status(400).json({
      errorcode: 400,
      errmsg: arr,
    });
  }
});

//Update existing company
router.put("/updatecompany", (req, res) => {
  //if (!req.body) {
    if (!req.body.company_id){
      db.getConnection((err, connection) => {
        if (err) throw err;
        const updateQuery = `UPDATE company SET taxid = ?, title = ?, name1 = ?, name2 = ?, shortname = ?, active_flag = ?, language = ?, WHERE id = ?`;
        const data = [req.body.taxid, req.body.title, req.body.name1,req.body.name2, req.body.shortname, req.body.active_flag, req.body.language, company_id]
        connection.query(updateQuery, data, (error, results, fields) => {
          if (error) {
            connection.release();
            res.status(400).json({
              ErrorCode : 400,
              ErrMessage : error
            })
          } else {
            res.status(200).json({
              ErrorCode : 200,
              ErrMessage : results,
              fields : fields
            })
          }
        });
      });
    }else{
      res.status(400).json({
        Errorcode : 400,
        Errmessage : 'Companyid is required'
      })
    }
  //}else{ 
    //res.status(400).json({
     // ErrorCode : 400,
     // Errmessage : 'Body Message is required'
    //})
 // }
});

module.exports = router;
