const express = require("express");
const multer = require("multer");
const db = require("../models/db");
const router = express.Router();
const path = require("path");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");

const uploadsPath = path.join(__dirname, "../../public/uploads");

var unique;
// Multer storage configuration with file validation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath);
  },
  filename: (req, file, cb) => {
    unique = uuidv4();
    cb(null, unique + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|jpg|png|jpeg|docx/; // Accept only specific file types
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(`Error: File type not allowed!. ${filetypes} only allowed`);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

router.post(
  "/RegisterApplicant",
  upload.single("resume"),
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    // Add more validation rules as needed
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Format error messages into a string
      const errorMessages = errors
        .array()
        .map((err) => err.msg)
        .join(" and ");

      // Render signup page with error messages
      return res.render("signup", { message: errorMessages });
    }

    const {
      full_name,
      email,
      password,
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
    } = req.body;

    try {
      // Hash password before storing it
      const hashedPassword = await bcrypt.hash(password, 10);
      const fileName = req.file && unique + req.file.originalname;
      const resumePath = req.file ? fileName : null;

      const query = `
      INSERT INTO applicant_information (
        full_name,
        email,
        password,
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
        cv_path
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        full_name,
        email,
        hashedPassword,
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
      ];

      db.query(query, values, (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error saving data.");
        } else {
          res.redirect("/Emteam");
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal server error");
    }
  }
);

module.exports = router;
