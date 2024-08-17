const express = require("express");
const db = require("../models/db");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { body, validationResult } = require("express-validator");

function ensureAuthenticated(req, res, next) {
  if (req.session.loggedinUser) {
    return next();
  } else {
    res.redirect("/in");
  }
}

// Configure multer
const uploadsPath = path.join(__dirname, "../../public/uploads");
var unique;

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

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = /pdf|doc|docx/;
    const extname = allowedFileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedFileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(
        new Error(
          "File type not allowed! Only PDF, DOC, and DOCX are accepted."
        )
      );
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});

// POST route for updating applicant information
router.post(
  "/myaccount/",
  ensureAuthenticated,
  upload.single("resume"),
  [
    // Input validation using express-validator
    body("email").isEmail().withMessage("Invalid email format."),
    body("full_name").notEmpty().withMessage("Full name is required."),
    body("phone_no").isMobilePhone().withMessage("Invalid phone number."),
    // Add more validation rules as needed
  ],
  (req, res) => {
    /* const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
 */
    const {
      id,
      full_name,
      email,
      age,
      position_title,
      area_of_expertise,
      education_level,
      cgpa,
      phone_no,
      other_skills,
      undergrad_school_name,
      undergrad_school_from,
      undergrad_school_to,
      undergrad_major_subject,
      high_school_name,
      high_school_from,
      high_school_to,
      tech_school_name,
      tech_school_from,
      tech_school_to,
      tech_school_major_subject,
      primary_language,
      language1,
      competency_level1,
      language2,
      competency_level2,
      language3,
      competency_level3,
      total_year_of_experience,
      work_duties,
      leaving_reason,
      filepath,
    } = req.body;

    const fileName = req.file
      ? `${unique}${path.basename(req.file.originalname)}`
      : filepath;
    const resumePath = req.file ? fileName : filepath;

    const sql = `
      UPDATE applicant_information
      SET
        full_name = ?, 
        email = ?, 
        age =?,
        position_title = ?, 
        area_of_expertise = ?, 
        education_level = ?, 
        cgpa = ?, 
        phone_no = ?, 
        other_skills = ?, 
        undergrad_school_name = ?, 
        undergrad_school_from = ?, 
        undergrad_school_to = ?, 
        undergrad_major_subject = ?, 
        high_school_name = ?, 
        high_school_from = ?, 
        high_school_to = ?, 
        tech_school_name = ?, 
        tech_school_from = ?, 
        tech_school_to = ?, 
        tech_school_major_subject = ?, 
        primary_language = ?, 
        language1 = ?, 
        competency_level1 = ?, 
        language2 = ?, 
        competency_level2 = ?, 
        language3 = ?, 
        competency_level3 = ?, 
        total_year_of_experience = ?,
        work_duties = ?, 
        leaving_reason = ?, 
        cv_path = ?
      WHERE id = ?;
    `;
    const values = [
      full_name,
      email,
      age,
      position_title,
      area_of_expertise,
      education_level,
      cgpa,
      phone_no,
      other_skills,
      undergrad_school_name,
      undergrad_school_from,
      undergrad_school_to,
      undergrad_major_subject,
      high_school_name,
      high_school_from,
      high_school_to,
      tech_school_name,
      tech_school_from,
      tech_school_to,
      tech_school_major_subject,
      primary_language,
      language1,
      competency_level1,
      language2,
      competency_level2,
      language3,
      competency_level3,
      total_year_of_experience,
      work_duties,
      leaving_reason,
      resumePath,
      id,
    ];

    db.query(sql, values, (error, results) => {
      if (error) {
        console.error("Database error:", error);
        return res
          .status(500)
          .send("An error occurred while updating your account.");
      }
      console.log("Account Updated successfully");
      res.redirect(`/myaccount?success=true`);
    });
  }
);

module.exports = router;
