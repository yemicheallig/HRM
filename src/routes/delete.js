const express = require("express");
const router = express.Router();
const db = require("../models/db");

router.get("/deleteJob/:id", (req, res) => {
  const jobId = req.params.id;
  const sql = `DELETE from job_postings where id = ?`;

  db.query(sql, [jobId], (error, result) => {
    if (error) throw error;
    console.log(`${jobId} deleted sucessfully`);
    res.redirect("/RJobs");
  });
});

router.get("/deleteCandidate/", (req, res) => {
  const userId = req.query.user;
  const jobId = req.query.job;

  const sql = `DELETE FROM app_job where app_id = ? and job_id = ?`;
  db.query(sql, [userId, jobId], (error, result) => {
    if (error) throw error;
    res.redirect("/Rcandidates");
  });
});

router.get("/deleteTask/:id", (req, res) => {
  const userId = req.params.id;
  const sql = `DELETE from tasks where id = ?`;

  db.query(sql, [userId], (error, result) => {
    if (error) throw error;
    console.log(`${userId} deleted sucessfully`);
    res.redirect("/Tasktodo");
  });
});

module.exports = router;
