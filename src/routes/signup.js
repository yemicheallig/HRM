const express = require("express");
const multer = require("multer");
const db = require("../models/db");
const router = express.Router();
const path = require("path");
const bcrypt = require("bcryptjs");
const { body, validationResult, check } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
const { error } = require("console");

const uploadsPath = path.join(__dirname, "../../public/uploads");

var unique;
// Multer storage configuration with file validation
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
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

var filetypes;
filetypes = ["pdf", "doc", "jpg", "png", "jpeg", "docx"]; // Accept only specific file types

const validateUserData = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("phone_no").isMobilePhone().withMessage("Invalid phone number."),
  check("resume")
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
    .withMessage("pdf, doc, jpg, png, jpeg, docx only allowed"),

  // Add more validation rules as needed
];

router.post(
  "/RegisterApplicant",
  validateUserData,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors
        .array()
        .map((err) => err.msg)
        .join(" and ");
      // Render signup page with error messages
      return res.render("signup", { message: errorMessages });
    }
    next();
  },
  upload.single("resume"),
  async (req, res) => {
    try {
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

      // Hash password before storing it
      const hashedPassword = await bcrypt.hash(password, 10);
      const fileName = req.file && `${unique}${req.file.originalname}`;
      const resumePath = req.file ? fileName : null;

      const required = [
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
        primary_language,
        language1,
        total_year_of_experience,
        work_duties,
        leaving_reason,
        resumePath,
      ];

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

      required.every((field) => {
        if (field == "" || field === null) {
          res.redirect("/up?message=fields");
        }
      });

      let sql = "SELECT email from applicant_information where email = ?";
      db.query(sql, [email], (err, data) => {
        if (data.length > 0) {
          res.render("signup", {
            message: "Email Already Taken, Please Choose Another One",
          });
        } else {
          db.query(query, values, (err, results) => {
            if (err) {
              console.error(err);
              return res
                .status(500)
                .render("signup", { message: "Error saving data." });
            } else {
              res.render("signin", { message: true });
            }
          });
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("<center><h1>Internal server error</h1></center>");
    }
  }
);

module.exports = router;
