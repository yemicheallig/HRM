const express = require("express");
const router = express.Router();
const db = require("../models/db");

function ensureAuthenticated(req, res, next) {
  if (req.session.loggedinUser) {
    next();
  } else {
    res.redirect("/in");
  }
}

// Basic route for home page
router.get("/", (req, res) => {
  if (req.session.loggedinUser) {
    res.render("index", { message: null, logged: true });
  } else {
    res.render("index", { message: null, logged: false });
  }
});

// Protected routes (only accessible by authenticated users)
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", { message: null });
});

/* router.get("/Emteam", ensureAuthenticated, (req, res) => {
  res.render("Emteam", { message: null });
});

router.get("/Emdirectory", ensureAuthenticated, (req, res) => {
  res.render("Emdirectory", { message: null });
}); */

router.get("/Tasktodo/", ensureAuthenticated, (req, res) => {
  let message = req.query.message;
  const sql = `SELECT * FROM tasks`;
  db.query(sql, (err, rows) => {
    if (err) throw err;
    res.render("Tasktodo", { data: rows, message: message || null });
  });
});

router.get("/Rcandidates", ensureAuthenticated, (req, res) => {
  let sql = `SELECT 
    applicant_information.id,job_postings.id as jobid,full_name,email,department,employment_type,education_level
    FROM 
    app_job
JOIN 
    applicant_information ON app_job.app_id = applicant_information.id
JOIN 
    job_postings ON app_job.job_id = job_postings.id`;

  db.query(sql, (error, rows) => {
    if (error) throw error;
    res.render("Rcandidates", { data: rows, message: null });
  });
});

router.get("/RJobs", ensureAuthenticated, (req, res) => {
  const sql = `SELECT * from job_postings`;
  db.query(sql, (error, rows) => {
    if (error) throw error;
    res.render("RJobs", { data: rows, message: null });
  });
});

// Public routes
router.get("/in", (req, res) => {
  res.render("signin", { message: null });
});

router.get("/up", (req, res) => {
  const message = req.query.message;
  if (message) {
    res.render("signup", {
      message:
        "All the fields are required,except language 1,2,3 and Technical/Vocational School details ",
    });
  } else {
    res.render("signup", { message: null });
  }
});

router.get("/viewJobs", ensureAuthenticated, (req, res) => {
  const { applied } = req.query;
  const sql = `SELECT * FROM job_postings`;
  db.query(sql, (error, row) => {
    if (error) throw error;
    res.render("viewJobs", {
      message: null,
      data: row,
      user: req.session.userid,
      applied: applied,
    });
  });
});

// Protected account-related routes
router.get("/myaccount", ensureAuthenticated, (req, res) => {
  const userId = req.session.userid;
  const success = req.query.success;
  const message = req.query.message;

  const sql = `SELECT * from applicant_information where id = ${userId}`;
  db.query(sql, (err, rows) => {
    if (err) throw err;
    if (message) {
      res.render("myaccount", {
        message: message,
        data: rows,
        success: success,
      });
    } else {
      res.render("myaccount", { message: null, data: rows, success: success });
    }
  });
});

router.get("/changepwd", ensureAuthenticated, (req, res) => {
  const userId = req.session.userid;
  const message = req.query.message;
  const sql = `SELECT * from applicant_information where id = ${userId}`;
  db.query(sql, (err, rows) => {
    if (err) throw err;
    if (message) {
      res.render("changepwd", { message: message, success: null });
    } else {
      res.render("changepwd", { message: null, success: null });
    }
  });
});

router.get("/addTask", ensureAuthenticated, (req, res) => {
  let message = req.query.message;
  res.render("addTask", { message: message || null });
});

router.get("/addJob", ensureAuthenticated, (req, res) => {
  res.render("addJob", { message: null });
});

router.get("/detailsCandidate/:id", (req, res) => {
  const userId = req.params.id;
  const sql = `SELECT * FROM applicant_information where id = ?`;

  db.query(sql, [userId], (error, row) => {
    if (error) throw error;
    res.render("detailsCandidate", { message: null, data: row });
  });
});

router.get("/detailsTask/:id", (req, res) => {
  const userId = req.params.id;
  const sql = `SELECT * FROM tasks where id = ?`;

  db.query(sql, [userId], (error, row) => {
    if (error) throw error;
    res.render("detailsTask", { message: null, data: row });
  });
});

router.get("/detailsJob/:id", (req, res) => {
  const jobId = req.params.id;
  const sql = `SELECT * FROM job_postings where id = ?`;

  db.query(sql, [jobId], (error, row) => {
    if (error) throw error;
    res.render("detailsJob", { message: null, data: row });
  });
});

router.get("/apply/", (req, res) => {
  const { user, job } = req.query;
  const sql = `INSERT into app_job(app_id,job_id) values(?,?)`;
  db.query(sql, [user, job], (error, results) => {
    if (error) throw error;
    console.log("Successfully Applied");
    res.redirect("/ViewJobs?applied=true");
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error logging out");
    }
    res.redirect("/in");
  });
});

module.exports = router;
