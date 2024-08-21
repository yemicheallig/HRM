const express = require("express");
const db = require("../models/db");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

router.post(
  "/changepwd",
  [
    // Validate and sanitize inputs
    body("currentPwd")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Current password is required."),
    body("newPwd")
      .trim()
      .isLength({ min: 8 })
      .withMessage("New password must be at least 8 characters long."),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // Format error messages into a string
      const errorMessages = errors
        .array()
        .map((err) => err.msg)
        .join(" and ");
      // Render signup page with error messages
      return res.redirect(`/changepwd?message=${errorMessages}`);
    }

    const { currentPwd, newPwd } = req.body;
    const userId = req.session.userid;

    const sql = "SELECT password FROM applicant_information WHERE id = ?";

    db.query(sql, [userId], async (error, results) => {
      if (error) {
        console.error("Database error:", error);
        return res
          .status(500)
          .redirect("/changepwd?message=An error occurred. Please try again.");
      }

      if (results.length === 0) {
        return res.status(404).redirect("/changepwd?message=User not found.");
      }

      const storedPassword = results[0].password;
      const isMatch = await bcrypt.compare(currentPwd, storedPassword);

      if (isMatch) {
        try {
          const hashedPassword = await bcrypt.hash(newPwd, 10);
          const updateSql =
            "UPDATE applicant_information SET password = ? WHERE id = ?";

          db.query(updateSql, [hashedPassword, userId], (updateErr) => {
            if (updateErr) {
              console.error("Password update error:", updateErr);
              return res
                .status(500)
                .redirect(
                  "/changepwd?message=Error updating password. Please try again."
                );
            }
            return res.redirect("changepwd", {
              message: null,
              success: true,
            });
          });
        } catch (hashErr) {
          console.error("Hashing error:", hashErr);
          return res
            .status(500)
            .redirect(
              "/changepwd?message=Error processing password. Please try again."
            );
        }
      } else {
        return res.redirect("changepwd?message=Current password is incorrect.");
      }
    });
  }
);

module.exports = router;
