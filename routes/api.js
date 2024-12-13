const express = require("express");
const router = express.Router();

// Route to get the top 5 leaderboard entries
router.get("/leaderboard", (req, res) => {
  // Call the stored procedure to fetch the top 5 leaderboard entries
  db.query("CALL sp_get_leaderboard()", (err, results) => {
    if (err) {
      console.error("Error fetching leaderboard:", err.message);
      return res
        .status(500)
        .json({ error: "Failed to fetch leaderboard data." });
    }

    // The first result set contains the leaderboard data
    const leaderboard = results[0];
    res.json(leaderboard);
  });
});

// Quizzes API: Search quizzes by category or display all quizzes if no category is provided
router.get("/quizzes", (req, res) => {
  const { category } = req.query;

  if (!category) {
    // No category provided, call the stored procedure to fetch all quizzes
    db.query("CALL sp_get_quizzes()", (err, results) => {
      if (err) {
        console.error("Error fetching quizzes:", err.message);
        return res.status(500).json({ error: "Failed to fetch quizzes." });
      }

      // The first result set contains the quizzes data
      const quizzes = results[0];
      res.json(quizzes);
    });
  } else {
    // Category provided, call the stored procedure to search for quizzes
    const searchTerm = `%${category}%`;
    db.query("CALL sp_search_quizzes(?)", [searchTerm], (err, results) => {
      if (err) {
        console.error("Error searching quizzes:", err.message);
        return res.status(500).json({ error: "Failed to search quizzes." });
      }

      const quizzes = results[0];
      if (quizzes.length === 0) {
        return res.json({
          message: "No quizzes found for the specified category.",
        });
      }

      res.json(quizzes);
    });
  }
});

module.exports = router;
