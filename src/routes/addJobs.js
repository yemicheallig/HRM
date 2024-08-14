const express = require("express");
const multer = require("multer");
const db = require("../models/db");
const router = express.Router();
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const uploadsPath = path.join(__dirname, "../../public/jobPic");

var unique;
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

router.post("/AddJob", upload.single("relatedImage"), (req, res) => {
  const {
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
  } = req.body;

  const fileName = req.file && unique + req.file.originalname;
  const relatedImage = req.file ? fileName : null;

  const sql = `
  INSERT INTO job_postings (
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
    relatedImage
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
  ];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error saving job posting.");
    } else {
      res.redirect("/addJob");
      console.log("Job posting added successfully!");
    }
  });
});

module.exports = router;
