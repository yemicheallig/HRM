CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_title VARCHAR(255),
    task_description TEXT,
    priority VARCHAR(255),
    status VARCHAR(255),
    start_date DATE,
    due_date DATE,
    attachments VARCHAR(255),
    category VARCHAR(255),
    progress INT CHECK (progress >= 0 AND progress <= 100)
);
