const express = require("express");
const router = express.Router();
const db = require("../models/db");
const { param, query, validationResult } = require("express-validator");

// Route to delete a job posting
router.get(
  "/deleteJob/:id",
  [param("id").isInt().withMessage("Invalid job ID")],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send("Invalid request");
    }

    const jobId = req.params.id;
    const sql = `DELETE FROM job_postings WHERE id = ?`;

    db.query(sql, [jobId], (error, result) => {
      if (error) {
        console.error("Database error:", error);
        return res
          .status(500)
          .send("An error occurred while deleting the job.");
      }
      console.log(`Job ID ${jobId} deleted successfully`);
      res.redirect("/RJobs");
    });
  }
);

// Route to delete a candidate from a job
router.get(
  "/deleteCandidate",
  [
    query("user").isInt().withMessage("Invalid user ID"),
    query("job").isInt().withMessage("Invalid job ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send("Invalid request");
    }

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
      res.redirect("/Rcandidates");
    });
  }
);

// Route to delete a task
router.get(
  "/deleteTask/:id",
  [param("id").isInt().withMessage("Invalid task ID")],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send("Invalid request");
    }

    const taskId = req.params.id;
    const sql = `DELETE FROM tasks WHERE id = ?`;

    db.query(sql, [taskId], (error, result) => {
      if (error) {
        console.error("Database error:", error);
        return res
          .status(500)
          .send("An error occurred while deleting the task.");
      }
      console.log(`Task ID ${taskId} deleted successfully`);
      res.redirect("/Tasktodo");
    });
  }
);

module.exports = router;
