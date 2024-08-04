const express = require("express");
const multer = require("multer");
const db = require("../models/db");
const router = express.Router();
const path = require("path");

const uploadsPath = path.join(__dirname, "../../public/uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/RegisterApplicant", upload.single("resume"), (req, res) => {
  const {
    full_name,
    email,
    password,
    position_title,
    vacancy_announcement_number,
    area_of_expertise,
    education_level,
    cgpa,
    phone_no,
    other_skills,
    grad_school_name,
    grad_school_from,
    grad_school_to,
    undergrad_school_name,
    undergrad_school_from,
    undergrad_school_to,
    undergrad_major_subject,
    high_school_name,
    high_school_from,
    high_school_to,
    high_school_major_subject,
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
    job_title,
    job_from,
    job_to,
    employer_email,
    supervisor_name,
    supervisor_phone,
    supervisor_email,
    job_duties,
    leaving_reason,
    license,
  } = req.body;
  console.log(email);
  const resumePath = req.file ? req.file.path : null;

  const query = `
  INSERT INTO applicant_information (
    full_name, email, password, position_title, vacancy_announcement_number,
    area_of_expertise, education_level, cgpa, phone_no, other_skills,grad_school_name,grad_school_from,
    grad_school_to, undergrad_school_name, undergrad_school_from, undergrad_school_to, undergrad_major_subject,
    high_school_name, high_school_from, high_school_to, high_school_major_subject,
    tech_school_name, tech_school_from, tech_school_to, tech_school_major_subject,
    primary_language, language1, competency_level1, language2, competency_level2, language3,competency_level3,
    job_title,job_from,job_to,job_duties,employer_email,supervisor_name,supervisor_phone,supervisor_email,leaving_reason,licenses_certifications, cv_path
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

  const values = [
    full_name,
    email,
    password,
    position_title,
    vacancy_announcement_number,
    area_of_expertise,
    education_level,
    cgpa,
    phone_no,
    other_skills,
    grad_school_name,
    grad_school_from,
    grad_school_to,
    undergrad_school_name,
    undergrad_school_from,
    undergrad_school_to,
    undergrad_major_subject,
    high_school_name,
    high_school_from,
    high_school_to,
    high_school_major_subject,
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
    resumePath,
    job_title,
    job_from,
    job_to,
    job_duties,
    employer_email,
    supervisor_name,
    supervisor_phone,
    supervisor_email,
    leaving_reason,
    license,
  ];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error saving data.");
    } else {
      res.render("signup");
      console.log("registered!!!");
    }
  });
});

module.exports = router;
