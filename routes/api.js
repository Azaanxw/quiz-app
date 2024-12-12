const express = require('express');
const router = express.Router();

// Route to get the top 5 leaderboard entries
router.get('/leaderboard', (req, res, next) => {
    // SQL query to retrieve the top 5 leaderboard entries
    const sqlQuery = `
        SELECT USERS.username, LEADERBOARD.score 
        FROM LEADERBOARD
        JOIN USERS ON LEADERBOARD.user_id = USERS.user_id
        ORDER BY LEADERBOARD.score DESC
        LIMIT 5;
    `;

    // Execute the query
    db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error('Error fetching leaderboard:', err.message);
            return res.status(500).json({ error: 'Failed to fetch leaderboard data.' });
        }

        // Return the results as a JSON response
        res.json(results);
    });
});

module.exports = router;


// Route to search quizzes by category
// Quizzes API: Search quizzes by category or display all quizzes if no category is provided
router.get("/quizzes", (req, res) => {
    const { category } = req.query;

    if (!category) {
        // No category provided, show all quizzes
        db.query(
            `SELECT QUIZZES.quiz_id, QUIZZES.title, CATEGORIES.name AS category, QUIZZES.difficulty, QUIZZES.num_questions, USERS.username AS created_by
             FROM QUIZZES
             JOIN CATEGORIES ON QUIZZES.category = CATEGORIES.category_id
             JOIN USERS ON QUIZZES.created_by = USERS.user_id`,
            (err, results) => {
                if (err) {
                    console.error("Error fetching quizzes:", err.message);
                    return res.status(500).json({ error: "Failed to fetch quizzes." });
                }

                res.json(results);
            }
        );
    } else {
        // Category provided, search for matching quizzes
        const searchTerm = `%${category}%`;
        db.query(
            `SELECT QUIZZES.quiz_id, QUIZZES.title, CATEGORIES.name AS category, QUIZZES.difficulty, QUIZZES.num_questions, USERS.username AS created_by
             FROM QUIZZES
             JOIN CATEGORIES ON QUIZZES.category = CATEGORIES.category_id
             JOIN USERS ON QUIZZES.created_by = USERS.user_id
             WHERE CATEGORIES.name LIKE ?`,
            [searchTerm],
            (err, results) => {
                if (err) {
                    console.error("Error fetching quizzes:", err.message);
                    return res.status(500).json({ error: "Failed to fetch quizzes." });
                }

                if (results.length === 0) {
                    return res.json({ message: "No quizzes found for the specified category." });
                }

                res.json(results);
            }
        );
    }
});

