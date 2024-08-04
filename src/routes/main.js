const express = require("express");
const router = express.Router();

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
  res.render("Tasktodo");
});

router.get("/Rcandidates", (req, res) => {
  res.render("Rcandidates");
});

router.get("/RJobs", (req, res) => {
  res.render("RJobs");
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

module.exports = router;
