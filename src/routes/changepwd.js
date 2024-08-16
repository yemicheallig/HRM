const express = require("express");
const db = require("../models/db");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const bcrypt = require("bcryptjs");

router.post("/changepwd", (req, res) => {
  const { currentPwd, newPwd } = req.body;
  const user = req.session.userid;
  let sql = "SELECT password FROM applicant_information where id = ?";

  db.query(sql, user, async (error, result) => {
    if (error) throw error;
    const pwd = result[0].password;
    const match = await bcrypt.compare(currentPwd, pwd);
    if (match) {
      const hashedPassword = await bcrypt.hash(newPwd, 10);
      sql = "UPDATE applicant_information set password = ? where id = ?";
      db.query(sql, [hashedPassword, user], (req, result) => {
        res.render("changepwd", { message: null, success: true });
      });
    } else {
      res.render("changepwd", {
        message: "Password does not match",
        success: null,
      });
    }
  });
});

module.exports = router;
