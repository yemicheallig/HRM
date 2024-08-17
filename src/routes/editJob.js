const express = require("express");
const db = require("../models/db");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { param, body, validationResult } = require("express-validator");

// Configure multer for file upload
var unique;
const uploadsPath = path.join(__dirname, "../../public/jobPic");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath);
  },
  filename: (req, file, cb) => {
    unique = uuidv4();
    const sanitizedFilename = path.basename(file.originalname);
    cb(null, `${unique}${sanitizedFilename}`); // Ensure proper file extension
  },
});

const fileFilterConfig = function (req, file, cb) {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/bmp",
    "image/svg+xml",
    "image/tiff",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB limit
  },
  fileFilter: fileFilterConfig,
});

// Route to get job details for editing
router.get(
  "/editJob/:id",
  [param("id").isInt().withMessage("Invalid job ID")],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send("Invalid request");
    }

    const jobId = req.params.id;
    const sql = `SELECT * FROM job_postings WHERE id = ?`;

    db.query(sql, [jobId], (err, rows) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .send("An error occurred while fetching job details.");
      }
      res.render("editJob", { data: rows });
    });
  }
);

// Route to update job details
router.post(
  "/editJob",
  upload.single("relatedImage"),
  [
    body("id").isInt().withMessage("Invalid job ID"),
    body("job_title").notEmpty().withMessage("Job title is required"),
    // Add additional validations as needed for other fields
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send("Invalid request");
    }

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

    const fileName = req.file ? `${unique}${req.file.originalname}` : filepath;
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
        console.error("Database error:", err);
        return res.status(500).send("Error updating job posting");
      } else {
        console.log("Job edited successfully");
        res.redirect(`/editJob/${id}`);
      }
    });
  }
);

module.exports = router;
