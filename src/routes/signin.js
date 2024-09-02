const express = require("express");
const router = express.Router();
const db = require("../models/db");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

function queryAsync(sql, params) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

router.post(
  "/LoginApplicant",
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors
        .array()
        .map((err) => err.msg)
        .join(" and ");

      res.render("signin", { message: errorMessages });
    }

    const email = req.body.email;
    const password = req.body.password;
    try {
      const sql =
        "SELECT id,email, password FROM applicant_information WHERE email = ?";
      const data = await queryAsync(sql, [email]);

      if (data.length > 0) {
        const user = data[0];

        // Compare submitted password with the stored hashed password
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          req.session.loggedinUser = true;
          req.session.email = email;
          req.session.userid = user.id;
          res.status(200).redirect("/viewJobs");
        } else {
          res.status(401).render("signin", { message: "password don't match" });
        }
      } else {
        res
          .status(401)
          .render("signin", { message: "Invalid email or password" });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).send("Internal server error");
    }
  }
);

module.exports = router;
