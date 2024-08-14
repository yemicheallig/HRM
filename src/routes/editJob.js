const express = require("express");
const db = require("../models/db");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

// Configure multer
var unique;
const uploadsPath = path.join(__dirname, "../../public/jobPic");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath);
  },
  filename: (req, file, cb) => {
    unique = uuidv4();
    cb(null, unique + file.originalname);
  },
});

const fileFilterConfig = function (req, file, cb) {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/gif" ||
    file.mimetype === "image/webp" ||
    file.mimetype === "image/bmp" ||
    file.mimetype === "image/svg+xml" ||
    file.mimetype === "image/tiff"
  ) {
    // calling callback with true as mimetype of file is an accepted image type
    cb(null, true);
  } else {
    // false to indicate not to store the file
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilterConfig,
});

router.get("/editJob/:id", (req, res) => {
  const jobId = req.params.id;
  const sql = `SELECT * from job_postings where id = ${jobId}`;
  db.query(sql, (err, rows) => {
    if (err) throw err;
    res.render("editJob", { data: rows });
  });
});

router.post("/editJob", upload.single("relatedImage"), (req, res) => {
  const {
    id,
    job_title,
    total_candidates,
    vacancies,
    department,
    job_description,
    job_requirements,
    employment_type,
    location,
    salary_range,
    application_deadline,
    experience_level,
    education_requirements,
    skills_required,
    job_benefits,
    contact_information,
    posting_date,
    job_category,
    responsibilities,
    application_method,
    additional_notes,
    filepath,
  } = req.body;

  const fileName = req.file && unique + req.file.originalname;
  const relatedImage = req.file ? fileName : filepath;

  const sql = `
  UPDATE job_postings 
  SET 
    job_title = ?,
    total_candidates = ?,
    vacancies = ?,
    department = ?,
    job_description = ?,
    job_requirements = ?,
    employment_type = ?,
    location = ?,
    salary_range = ?,
    application_deadline = ?,
    experience_level = ?,
    education_requirements = ?,
    skills_required = ?,
    job_benefits = ?,
    contact_information = ?,
    posting_date = ?,
    job_category = ?,
    responsibilities = ?,
    application_method = ?,
    additional_notes = ?,
    relatedImage = ?
  WHERE 
    id = ?;
`;

  const values = [
    job_title,
    total_candidates,
    vacancies,
    department,
    job_description,
    job_requirements,
    employment_type,
    location,
    salary_range,
    application_deadline,
    experience_level,
    education_requirements,
    skills_required,
    job_benefits,
    contact_information,
    posting_date,
    job_category,
    responsibilities,
    application_method,
    additional_notes,
    relatedImage,
    id,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error updating job posting");
    } else {
      console.log("Job Edited");
      res.redirect(`/editJob/${id}`);
    }
  });
});

module.exports = router;
