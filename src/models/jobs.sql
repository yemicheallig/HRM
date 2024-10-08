CREATE TABLE job_postings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_title VARCHAR(255) NOT NULL,
    total_candidates INT NOT NULL,
    vacancies INT NOT NULL,
    department VARCHAR(255) NOT NULL,
    job_description TEXT NOT NULL,
    job_requirements TEXT NOT NULL,
    employment_type VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    salary_range VARCHAR(255) NOT NULL,
    application_deadline DATE NOT NULL,
    experience_level VARCHAR(255) NOT NULL,
    education_requirements VARCHAR(255) NOT NULL,
    skills_required TEXT NOT NULL,
    job_benefits TEXT NOT NULL,
    contact_information VARCHAR(255) NOT NULL,
    posting_date DATE NOT NULL,
    job_category VARCHAR(255) NOT NULL,
    responsibilities TEXT NOT NULL,
    application_method VARCHAR(255) NOT NULL,
    additional_notes TEXT,
    relatedImage VARCHAR(255)
);