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

ALTER TABLE LEADERBOARD ADD UNIQUE(user_id);
-- VIEWS
-- Leaderboard view
CREATE VIEW vw_leaderboard AS
SELECT USERS.username, LEADERBOARD.score
FROM LEADERBOARD
JOIN USERS ON LEADERBOARD.user_id = USERS.user_id
ORDER BY LEADERBOARD.score DESC;

-- Quiz details view
CREATE OR REPLACE VIEW vw_quiz_details AS
SELECT 
    QUIZZES.quiz_id,
    QUIZZES.title,
    CATEGORIES.name AS category,
    QUIZZES.difficulty,
    QUIZZES.num_questions,
    QUIZZES.created_at 
FROM QUIZZES
JOIN CATEGORIES ON QUIZZES.category = CATEGORIES.category_id;

-- Categories view 
CREATE VIEW vw_categories AS
SELECT category_id, name
FROM CATEGORIES;

-- STORED PROCEDURES

-- Register user
DELIMITER //

CREATE PROCEDURE sp_register_user(
    IN username VARCHAR(50),
    IN email VARCHAR(100),
    IN password VARCHAR(255)
)
BEGIN
    INSERT INTO USERS (username, email, password)
    VALUES (username, email, password);
END //

DELIMITER ;

-- User login
DELIMITER //

CREATE PROCEDURE sp_user_login(
    IN email VARCHAR(100)
)
BEGIN
    SELECT * FROM USERS WHERE email = email;
END //

DELIMITER ;

-- Add quiz

DELIMITER //

CREATE PROCEDURE sp_add_quiz(
    IN title VARCHAR(255),
    IN category INT,
    IN difficulty VARCHAR(10),
    IN num_questions INT,
    IN created_by INT
)
BEGIN
    INSERT INTO QUIZZES (title, category, difficulty, num_questions, created_by)
    VALUES (title, category, difficulty, num_questions, created_by);
    
    SELECT LAST_INSERT_ID() AS quiz_id; 
END //

DELIMITER ;

-- Fetch quizzes by category

DELIMITER //

CREATE PROCEDURE sp_fetch_quizzes_by_category(
    IN category_name VARCHAR(100)
)
BEGIN
    SELECT QUIZZES.quiz_id, QUIZZES.title, CATEGORIES.name AS category
    FROM QUIZZES
    JOIN CATEGORIES ON QUIZZES.category = CATEGORIES.category_id
    WHERE CATEGORIES.name LIKE CONCAT('%', category_name, '%');
END //

DELIMITER ;

-- Update leaderboard
DELIMITER //

CREATE PROCEDURE sp_update_leaderboard(
    IN user_id INT,
    IN new_score INT
)
BEGIN
    INSERT INTO LEADERBOARD (user_id, score)
    VALUES (user_id, new_score)
    ON DUPLICATE KEY UPDATE score = VALUES(score);

END //


DELIMITER ;

DELIMITER $$

CREATE PROCEDURE sp_get_quiz_details(IN quizId INT)
BEGIN
    SELECT 
        QUIZZES.title,
        QUIZ_QUESTIONS.question,
        QUIZ_QUESTIONS.correct_answer,
        QUIZ_QUESTIONS.incorrect_answers
    FROM QUIZZES
    JOIN QUIZ_QUESTIONS ON QUIZZES.quiz_id = QUIZ_QUESTIONS.quiz_id
    WHERE QUIZZES.quiz_id = quizId;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE sp_update_user_score(
    IN userId INT,
    IN additionalScore INT
)
BEGIN
    UPDATE USERS
    SET score = score + additionalScore
    WHERE user_id = userId;
END$$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE sp_sync_leaderboard(
    IN userId INT,
    IN score INT
)
BEGIN
    INSERT INTO LEADERBOARD (user_id, score)
    VALUES (userId, score)
    ON DUPLICATE KEY UPDATE score = VALUES(score);
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE sp_search_quizzes(
    IN searchTerm VARCHAR(255)
)
BEGIN
    SELECT 
        QUIZZES.quiz_id,
        QUIZZES.title,
        QUIZZES.created_at,
        USERS.username AS created_by,
        CATEGORIES.name AS category_name
    FROM QUIZZES
    JOIN USERS ON QUIZZES.created_by = USERS.user_id
    JOIN CATEGORIES ON QUIZZES.category = CATEGORIES.category_id
    WHERE LOWER(CATEGORIES.name) LIKE searchTerm
    ORDER BY QUIZZES.created_at DESC;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE sp_get_leaderboard()
BEGIN
    SELECT 
        username, 
        score 
    FROM USERS
    ORDER BY score DESC
    LIMIT 5;
END$$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE sp_get_quizzes()
BEGIN
    SELECT 
        QUIZZES.quiz_id,
        QUIZZES.title,
        QUIZZES.created_at,
        USERS.username AS created_by
    FROM QUIZZES
    JOIN USERS ON QUIZZES.created_by = USERS.user_id
    ORDER BY QUIZZES.created_at DESC;
END$$

DELIMITER ;
