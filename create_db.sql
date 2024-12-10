CREATE DATABASE IF NOT EXISTS `quizapp`;
USE `quizapp`;

CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'app2024';
GRANT ALL PRIVILEGES ON quizapp.* TO 'root'@'localhost';

-- USER Table
CREATE TABLE IF NOT EXISTS USER(
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(50) NOT NULL
);

-- LEADERBOARD Table
CREATE TABLE IF NOT EXISTS LEADERBOARD (
    user_id INT NOT NULL,
    score INT NOT NULL,
	user_rank INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES USER(user_id)
);

-- QUIZ Table
CREATE TABLE IF NOT EXISTS QUIZ (
    quiz_id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(255) NOT NULL,
    difficulty VARCHAR(6) NOT NULL,
    length INT NOT NULL,
    type ENUM('MultipleChoice', 'True-False', 'Both') NOT NULL
);

-- QUESTION Table
CREATE TABLE IF NOT EXISTS QUESTION (
    question_id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    type ENUM('MultipleChoice', 'True-False', 'Both') NOT NULL,
    category VARCHAR(255) NOT NULL,
    question_text VARCHAR(255) UNIQUE NOT NULL,
    correct_answer VARCHAR(255) NOT NULL,
    incorrect_answers VARCHAR(255) NOT NULL,
    FOREIGN KEY (quiz_id) REFERENCES QUIZ(quiz_id)
);
