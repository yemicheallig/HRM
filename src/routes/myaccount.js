const express = require("express");
const db = require("../models/db");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

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
    const filetypes = /pdf|doc|docx/; // Accept only specific file types
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: File type not allowed!");
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

router.post(
  "/myaccount/",
  ensureAuthenticated,
  upload.single("resume"),
  (req, res) => {
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

    const fileName = req.file && unique + req.file.originalname;
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
    console.log(values);
    db.query(sql, values, (error, results) => {
      if (error) throw error;
      console.log(`Account Updated successfully`);
      res.redirect(`/myaccount?success=true`);
    });
  }
);

module.exports = router;
