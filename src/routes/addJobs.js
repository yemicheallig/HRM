const express = require("express");
const multer = require("multer");
const db = require("../models/db");
const router = express.Router();
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const { body, validationResult } = require("express-validator");

const uploadsPath = path.join(__dirname, "../../public/jobPic");
var unique;

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath);
  },
  filename: (req, file, cb) => {
    unique = uuidv4();
    const sanitizedFilename = path.basename(file.originalname);
    cb(null, `${unique}${sanitizedFilename}`);
  },
});

const fileFilterConfig = (req, file, cb) => {
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
    cb(new Error("Unsupported file type"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilterConfig,
});

const validateJobData = [
  body("job_title").trim().isLength({ min: 1 }).escape(),
  body("total_candidates").isInt({ min: 0 }),
  body("vacancies").isInt({ min: 1 }),
  body("department").trim().escape(),
  body("job_description").trim().escape(),
  body("job_requirements").trim().escape(),
  body("employment_type").trim().escape(),
  body("location").trim().escape(),
  body("salary_range").trim().escape(),
  body("application_deadline").isISO8601().toDate(),
  body("experience_level").trim().escape(),
  body("education_requirements").trim().escape(),
  body("skills_required").trim().escape(),
  body("job_benefits").trim().escape(),
  body("contact_information").trim().escape(),
  body("posting_date").isISO8601().toDate(),
  body("job_category").trim().escape(),
  body("responsibilities").trim().escape(),
  body("application_method").trim().escape(),
  body("additional_notes").trim().optional().escape(),
];

router.post(
  "/AddJob",
  upload.single("relatedImage"),
  validateJobData,
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
      /*       job_category,
       */ responsibilities,
      application_method,
      additional_notes,
    } = req.body;

    const fileName = req.file && `${unique}${req.file.originalname}`;
    const relatedImage = req.file ? fileName : null;

    const sql = `
      INSERT INTO job_postings (
        job_title, total_candidates, vacancies, department, job_description,
        job_requirements, employment_type, location, salary_range,
        application_deadline, experience_level, education_requirements,
        skills_required, job_benefits, contact_information, posting_date,
        responsibilities, application_method, additional_notes,
        relatedImage
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
      /*       job_category,
       */ responsibilities,
      application_method,
      additional_notes,
      relatedImage,
    ];

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        res.status(500).send("Error saving job posting.");
      } else {
        res.redirect("/addJob");
      }
    });
  }
);

module.exports = router;
