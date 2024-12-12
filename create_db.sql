CREATE DATABASE IF NOT EXISTS `quizapp`;
USE `quizapp`;
-- USER Table
CREATE TABLE IF NOT EXISTS USERS(
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    score INT DEFAULT 0,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- LEADERBOARD Table
CREATE TABLE IF NOT EXISTS LEADERBOARD (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    user_id INT NOT NULL,              
    score INT NOT NULL,                
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (user_id) REFERENCES USERS(user_id) ON DELETE CASCADE
);
CREATE TABLE CATEGORIES (
    category_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO CATEGORIES (category_id, name) VALUES
(9, 'General Knowledge'),
(10, 'Books'),
(11, 'Film'),
(12, 'Music'),
(21, 'Sports'),
(25, 'Art'),
(27, 'Animals'),
(28, 'Vehicles');
-- QUIZ Table
CREATE TABLE QUIZZES (
    quiz_id INT AUTO_INCREMENT PRIMARY KEY,       
    title VARCHAR(255) NOT NULL,                         
    category INT NOT NULL,                                 
    difficulty ENUM('easy', 'medium', 'hard') NOT NULL DEFAULT 'easy', 
    num_questions INT NOT NULL,                           
    created_by INT NOT NULL,                              
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,        
    FOREIGN KEY (category) REFERENCES CATEGORIES(category_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES USERS(user_id) ON DELETE CASCADE
);
-- QUESTION Table
CREATE TABLE QUIZ_QUESTIONS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL, 
    question TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    incorrect_answers TEXT NOT NULL,
    FOREIGN KEY (quiz_id) REFERENCES QUIZZES(quiz_id) ON DELETE CASCADE
);
