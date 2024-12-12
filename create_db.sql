CREATE DATABASE IF NOT EXISTS `quizapp`;
USE `quizapp`;
-- USER Table
CREATE TABLE IF NOT EXISTS USERS(
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP -- Timestamp for account creation
);

-- LEADERBOARD Table
CREATE TABLE IF NOT EXISTS LEADERBOARD (
    user_id INT NOT NULL,
    score INT NOT NULL,
	user_rank INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES USERS(user_id)
);

-- QUIZ Table
CREATE TABLE QUIZZES (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category INT NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    num_questions INT NOT NULL, 
    created_by INT NOT NULL, -- Link to user table
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES USERS(user_id)
);


-- QUESTION Table
CREATE TABLE QUIZ_QUESTIONS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL, 
    question TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    incorrect_answers TEXT NOT NULL,
    FOREIGN KEY (quiz_id) REFERENCES QUIZZES(id) ON DELETE CASCADE
);
