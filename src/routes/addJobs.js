const express = require("express");
const multer = require("multer");
const db = require("../models/db");
const router = express.Router();
const path = require("path");

const uploadsPath = path.join(__dirname, "../../public/jobPic");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
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
  const relatedImage = req.file ? req.file.path : null;
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
    additional_notes
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
  ];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error saving job posting.");
    } else {
      res.render("index");
      console.log("Job posting added successfully!");
    }
  });
});

module.exports = router;
