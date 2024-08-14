CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_title VARCHAR(255) NOT NULL,
    task_description TEXT,
    priority ENUM('Low', 'Medium', 'High', 'Urgent') NOT NULL,
    status ENUM('NotStarted', 'InProgress', 'Completed', 'OnHold') NOT NULL,
    start_date DATE,
    due_date DATE,
    attachments VARCHAR(255),
    category VARCHAR(255),
    progress INT CHECK (progress >= 0 AND progress <= 100)
);
