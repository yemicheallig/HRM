const express = require("express");
const router = express.Router();
const db = require("../models/db");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

router.post(
  "/LoginApplicant",
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const email = req.body.email;
    const password = req.body.password;

    const sql =
      "SELECT id,email, password FROM applicant_information WHERE email = ?";

    db.query(sql, [email], async function (err, data) {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal server error");
      }

      if (data.length > 0) {
        const user = data[0];

        // Compare submitted password with the stored hashed password
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          req.session.loggedinUser = true;
          req.session.email = email;
          req.session.userid = user.id;
          res.status(200).redirect("/myaccount");
        } else {
          res.status(401).render("signin", { message: "password dont match" });
        }
      } else {
        res
          .status(401)
          .render("signin", { message: "Invalid email or password" });
      }
    });
  }
);

module.exports = router;
