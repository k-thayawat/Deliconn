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
              req.body.company,
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
                      req.body.company,
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
router.put("/update", (req, res) => {
  if (req.body.company) {
    //handel request String
    let updateqry = "UPDATE company SET ";
    let params = [];
    if (req.body.taxid) {
      updateqry = updateqry.concat("taxid = ?,");
      params.push(req.body.taxid);
    }
    if (req.body.title) {
      updateqry = updateqry.concat("title = ?,");
      params.push(req.body.title);
    }
    if (req.body.name1) {
      updateqry = updateqry.concat("name1 = ?,");
      params.push(req.body.name1);
    }
    if (req.body.name2) {
      updateqry = updateqry.concat("name2 = ?,");
      params.push(req.body.name2);
    }
    if (req.body.shortname) {
      updateqry = updateqry.concat("shortname = ?,");
      params.push(req.body.shortname);
    }
    if (req.body.active) {
      let active = (req.body.active = true ? 1 : 0);
      updateqry = updateqry.concat("actived_flag = ?,");
      params.push(active);
    }
    if (req.body.language) {
      updateqry = updateqry.concat("language = ?,");
      params.push(req.body.language);
    }

    updateqry = updateqry.concat("WHERE company_id = ?");
    updateqry = updateqry.replace(",WHERE", " WHERE");
    params.push(req.body.company);
    //Array of Errors
    let err = [];
    db.getConnection((err, connection) => {
      if (!err) {
        connection.beginTransaction((err) => {
          if (err) {
            //arr.push(err);
            res.status(500).send(Returnformat(500, err));
          } else {
            connection.query(updateqry, params, (error, results, fields) => {
              if (error) {
                connection.release();
                res.status(400).send(Returnformat(500, error));
              } else {
                if (req.body.branch) {
                  updateqry = "";
                  params = [];
                  for (let i = 0; i < req.body.branch.length; i++) {
                    updateqry = updateqry.concat("UPDATE branch SET ");
                    if (req.body.branch[i].code) {
                      updateqry = updateqry.concat("branch_code = ?,");
                      params.push(req.body.branch[i].code);
                    }
                    if (req.body.branch[i].name) {
                      updateqry = updateqry.concat("branch_name = ?,");
                      params.push(req.body.branch[i].name);
                    }
                    if (req.body.branch[i].housenumber) {
                      updateqry = updateqry.concat("house_number = ?,");
                      params.push(req.body.branch[i].housenumber);
                    }
                    if (req.body.branch[i].address1) {
                      updateqry = updateqry.concat("address1 = ?,");
                      params.push(req.body.branch[i].address1);
                    }
                    if (req.body.branch[i].subdistrict) {
                      updateqry = updateqry.concat("sub_district = ?,");
                      params.push(req.body.branch[i].subdistrict);
                    }
                    if (req.body.branch[i].district) {
                      updateqry = updateqry.concat("district = ?,");
                      params.push(req.body.branch[i].district);
                    }
                    if (req.body.branch[i].province) {
                      updateqry = updateqry.concat("province = ?,");
                      params.push(req.body.branch[i].province);
                    }
                    if (req.body.branch[i].zipcode) {
                      updateqry = updateqry.concat("zipcode = ?,");
                      params.push(req.body.branch[i].zipcode);
                    }
                    if (req.body.branch[i].country) {
                      updateqry = updateqry.concat("country = ?,");
                      params.push(req.body.branch[i].country);
                    }
                    if (req.body.branch[i].language) {
                      updateqry = updateqry.concat("language = ?,");
                      params.push(req.body.branch[i].language);
                    }
                    if (req.body.branch[i].remark) {
                      updateqry = updateqry.concat("remark = ?,");
                      params.push(req.body.branch[i].remark);
                    }
                    //Added last as Where
                    updateqry = updateqry.concat(
                      "WHERE branch_id = ? and company_id = ?"
                    );
                    updateqry = updateqry.replace(",WHERE", " WHERE");

                    if (req.body.branch[i].length !=req.body.branch.length - 1) {
                      updateqry = updateqry.concat(";");
                    }
                    params.push(req.body.branch[i].branchid, req.body.company);
                  }
                  connection.query(updateqry, params, (err, recb) => {
                    if (err) {
                      connection.rollback();
                      connection.release();
                      res.status(400).send(Returnformat(400, err));
                    } else {
                      connection.commit((err) => {
                        if (err) {
                          connection.rollback();
                          connection.release();
                          res.status(500).send(Returnformat(500, err));
                        } else {
                          connection.release();
                          res
                            .status(200)
                            .send(Returnformat(200, "Update Company and branch Success"));
                        }
                      });
                    }
                  });
                } else {
                  connection.commit((err) => {
                    if (err) {
                      res.status(500).send(Returnformat(500, err));
                    } else {
                      connection.release();
                      res
                        .status(200)
                        .send(Returnformat(200, "Update Company Success"));
                    }
                  });
                }
              }
            });
          }
        });
      }
    });
  } else {
    res.status(400).send(Returnformat(400, "company is requried"));
  }
});

function Returnformat(st, msg) {
  const Error = {
    code: st,
    message: msg,
  };
  return Error;
}
module.exports = router;
