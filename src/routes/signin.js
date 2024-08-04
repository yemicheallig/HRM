var express = require("express");
var router = express.Router();
var db = require("../models/db");

router.post("/LoginApplicant", (req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  var sql =
    "SELECT email,password FROM applicant_information WHERE email_address =? AND password =?";
  db.query(sql, [email, password], function (err, data) {
    if (err) throw err;
    if (data.length > 0) {
      req.session.loggedinUser = true;
      req.session.email = email;
    } else {
      res.render("signin");
    }
  });
});
module.exports = router;
