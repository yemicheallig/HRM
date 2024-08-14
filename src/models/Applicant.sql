CREATE TABLE applicant_information (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    position_title VARCHAR(255) NOT NULL,
    area_of_expertise VARCHAR(255) NOT NULL,
    education_level VARCHAR(255) NOT NULL,
    cgpa DECIMAL(3, 2) NOT NULL,
    phone_no VARCHAR(15) NOT NULL,
    other_skills TEXT,
    undergrad_school_name VARCHAR(255),
    undergrad_school_from DATE,
    undergrad_school_to DATE,
    undergrad_major_subject TEXT,
    high_school_name VARCHAR(255),
    high_school_from DATE,
    high_school_to DATE,
    high_school_major_subject TEXT,
    tech_school_name VARCHAR(255),
    tech_school_from DATE,
    tech_school_to DATE,
    tech_school_major_subject TEXT,
    primary_language VARCHAR(255),
    language1 VARCHAR(255),
    competency_level1 ENUM('I', 'II', 'III', 'IV', 'V'),
    language2 VARCHAR(255),
    competency_level2 ENUM('I', 'II', 'III', 'IV', 'V'),
    language3 VARCHAR(255),
    competency_level3 ENUM('I', 'II', 'III', 'IV', 'V'),
    job_title VARCHAR(255),
    job_from DATE,
    job_to DATE,
    employer_email VARCHAR(255),
    supervisor_name VARCHAR(255),
    supervisor_phone VARCHAR(15),
    supervisor_email VARCHAR(255),
    job_duties TEXT,
    leaving_reason TEXT,
    licenses_certifications TEXT,
    cv_path VARCHAR(255)
);
