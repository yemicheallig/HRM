const express = require("express");
const router = express.Router();
const db = require("../models/db");

router.post("/LoginApplicant", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const sql =
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
