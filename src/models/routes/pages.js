const express = require("express");
const router = express.Router();
const db = require("../models/db");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

router.get("/Emteam", (req, res) => {
  res.render("Emteam");
});

router.get("/Emdirectory", (req, res) => {
  res.render("Emdirectory");
});

router.get("/Tasktodo", (req, res) => {
  const sql = `SELECT * FROM tasks`;
  db.query(sql, (err, rows) => {
    if (err) throw err;
    res.render("Tasktodo", { data: rows });
  });
});

router.get("/Rcandidates", (req, res) => {
  const sql = `SELECT * FROM applicant_information`;
  db.query(sql, (err, rows) => {
    if (err) throw err;
    res.render("Rcandidates", { data: rows });
  });
});

router.get("/RJobs", (req, res) => {
  const sql = `SELECT * from job_postings`;
  db.query(sql, (err, rows) => {
    if (err) throw err;
    res.render("RJobs", { data: rows });
  });
});

router.get("/in", (req, res) => {
  res.render("signin");
});

router.get("/up", (req, res) => {
  res.render("signup");
});

router.get("/viewJobs", (req, res) => {
  res.render("viewJobs");
});

router.get("/myaccount", (req, res) => {
  res.render("myaccount");
});

router.get("/addTask", (req, res) => {
  res.render("addTask");
});

router.get("/addJob", (req, res) => {
  res.render("addJob");
});

router.get("/editJob", (req, res) => {
  res.render("editJob");
});

router.get("/editTask", (req, res) => {
  res.render("editTask");
});

module.exports = router;
