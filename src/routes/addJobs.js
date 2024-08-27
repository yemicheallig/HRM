const express = require("express");
const multer = require("multer");
const db = require("../models/db");
const router = express.Router();
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const { body, validationResult, check } = require("express-validator");

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
    cb(null, false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilterConfig,
});

const filetypes = ["jpg", "jpeg", "png", "gif", "webp", "svg+xml", "tiff"];

const validateJobData = [
  check("relatedImage")
    .custom((value, { req }) => {
      const fileExtension = path
        .extname(req.file.originalname)
        .toLowerCase()
        .slice(1);
      if (!filetypes.includes(fileExtension)) {
        return false;
      }
      return true;
    })
    .withMessage("jpg, jpeg, png, gif, webp, svg+xml, tiff only allowed"),
];



router.post(
  "/AddJob",
  upload.single("relatedImage"),
  validateJobData,
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors
        .array()
        .map((err) => err.msg)
        .join(" and ");
      return res.status(400).render("addJOb", { message: errorMessages });
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
      responsibilities,
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
    const required = [
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
      responsibilities,
      application_method,
      additional_notes,
      relatedImage,
    ];

    required.every((field) => {
      if (field == "" || field === null) {
        res
          .status(400)
          .render("addJOb", { message: "Please Fill In All of the field" });
        return false;
      }
    });

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
        return res.status(500).send("Error saving job posting.");
      } else {
        return res.render("addJob", { message: "success" });
      }
    });
  }
);

module.exports = router;
