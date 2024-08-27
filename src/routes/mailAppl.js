var nodemailer = require("nodemailer");
const express = require("express");
const router = express.Router();

require("dotenv").config();

router.get("/mailAppl", (req, res) => {
  const email = req.query.email;
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  var mailOptions = {
    from: "imnahomm@gmail.com",
    to: email,
    subject: "Sending Email using Node.js",
    text: "That was easy!",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      const userId = req.query.user;
      const jobId = req.query.job;
      const sql = `DELETE FROM app_job WHERE app_id = ? AND job_id = ?`;

      db.query(sql, [userId, jobId], (error, result) => {
        if (error) {
          console.error("Database error:", error);
          return res
            .status(500)
            .send("An error occurred while deleting the candidate.");
        }
        res.redirect(`/Rcandidates?${email}Accepted`);
      });
    }
  });
});

module.exports = router;
