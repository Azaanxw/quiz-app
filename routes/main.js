module.exports = function (app) {
  //Password hashing setup
  const bcrypt = require("bcrypt");
  const saltRounds = 10; // Number of salt rounds for hashing
  const categoryMap = {
    9: "General Knowledge",
    10: "Books",
    11: "Film",
    12: "Music",
    21: "Sports",
    25: "Art",
    27: "Animals",
    28: "Vehicles",
  };

  // Request module
  const request = require("request");
  // Authentication check to see if the user is logged in or not
  var isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
      // checks to see if the user is authenticated
      next();
    } else {
      // if the user isn't logged in, then redirect to the home page
      console.log("Error! Please login to see all pages!");
      res.redirect("/usr/293/login");
    }
  };

  // Handle our routes
  app.get("/", isAuthenticated, (req, res) => {
    const userId = req.session.userId; // Assuming userId is stored in the session
    const username = req.session.username || null;

    // Call the stored procedure to fetch the leaderboard
    db.query("CALL sp_get_leaderboard()", (err, leaderboardResults) => {
        if (err) {
            console.error("Error fetching leaderboard:", err.message);
            req.flash("error", "Failed to fetch leaderboard data.");
            return res.redirect("/usr/293/login");
        }

        const leaderboard = leaderboardResults[0]; // The first result set contains the leaderboard data

        // Call the stored procedure to fetch quizzes
        db.query("CALL sp_get_quizzes()", (err, quizResults) => {
            if (err) {
                console.error("Error fetching quizzes:", err.message);
                req.flash("error", "Failed to fetch quizzes.");
                return res.redirect("/usr/293/login");
            }

            const quizzes = quizResults[0]; // The first result set contains the quizzes data

            // Fetch the user's score
            db.query("SELECT score FROM USERS WHERE user_id = ?", [userId], (err, userScoreResults) => {
                if (err) {
                    console.error("Error fetching user score:", err.message);
                    req.flash("error", "Failed to fetch user score.");
                    return res.redirect("/usr/293/login");
                }

                const userScore = userScoreResults.length > 0 ? userScoreResults[0].score : 0;
                const successMessage = req.flash("success");
                const errorMessage = req.flash("error");

                // Render the index page with quizzes, leaderboard, and user's score
                res.render("index.ejs", {
                    quizzes,
                    leaderboard,
                    userScore,
                    successMessage,
                    errorMessage,
                    username,
                });
            });
        });
    });
});


  app.get("/about", isAuthenticated, (req, res) => {
    const successMessage = req.flash("success");
    const errorMessage = req.flash("error");
    const username = req.session.username || null; // Pass username if logged in

    res.render("about.ejs", { successMessage, errorMessage, username });
  });

  // Login page
  app.get("/login", (req, res) => {
    const successMessage = req.flash("success");
    const errorMessage = req.flash("error");
    res.render("login.ejs", { successMessage, errorMessage });
  });

  app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Use stored procedure sp_user_login to retrieve user data
        db.query("CALL sp_user_login(?)", [email], async (error, results) => {
            if (error) {
                console.error("Database Error:", error.message);
                req.flash("error", "Internal Server Error");
                return res.redirect("/usr/293/login");
            }

            const user = results[0][0]; // Extract the first result from the procedure
            if (user) {
                const match = await bcrypt.compare(password, user.password); // Compare provided password with stored hash

                if (match) {
                    // Update session data for the new user
                    req.session.userId = user.user_id; 
                    req.session.username = user.username;

                    // Save the session explicitly
                    req.session.save((err) => {
                        if (err) {
                            console.error("Session Save Error:", err.message);
                            req.flash("error", "Failed to log in. Please try again.");
                            return res.redirect("/usr/293/login");
                        }

                        req.flash("success", "Login successful!");
                        return res.redirect("/usr/293/");

                    });
                } else {
                    req.flash("error", "Incorrect email or password!");
                    return res.redirect("/usr/293/login");
                }
            } else {
                req.flash("error", "Incorrect email or password!");
                return res.redirect("/usr/293/login");
            }
        });
    } catch (err) {
        console.error("Error during login:", err.message);
        req.flash("error", "An error occurred while logging in.");
        return res.redirect("/usr/293/login");
    }
});


  // Register page
  app.get("/register", function (req, res) {
    const successMessage = req.flash("success");
    const errorMessage = req.flash("error");

    res.render("register.ejs", { successMessage, errorMessage });
  });

  // Handling register page form
  app.post("/register", async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    // Validate inputs
    if (password !== confirmPassword) {
      req.flash("error", "Passwords do not match!");
      return res.redirect("/usr/293/register");
    }

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Call the stored procedure to register the user
      db.query(
        "CALL sp_register_user(?, ?, ?)",
        [username, email, hashedPassword],
        (error, results) => {
          if (error) {
            if (error.code === "ER_DUP_ENTRY") {
              req.flash("error", "Username or email already exists!");
            } else {
              console.error("Database Error:", error.message);
              req.flash("error", "An error occurred while registering.");
            }
            return res.redirect("/usr/293/register");
          }

          req.flash("success", "Registration successful! Please log in.");
          res.redirect("/usr/293/login");
        }
      );
    } catch (err) {
      console.error("Hashing Error:", err.message);
      req.flash(
        "error",
        "An error occurred while processing your registration."
      );
      res.redirect("/usr/293/register");
    }
  });

  //Logout route
  app.get("/logout", isAuthenticated, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err.message);
            req.flash("error", "Failed to log out. Please try again.");
            return res.redirect("/usr/293/");
        }

        res.clearCookie("connect.sid"); // Clear session cookie
        console.log("Logged out successfully!");
        res.redirect("/usr/293/login");
    });
});


  // Quiz implementation

  // Route for quiz setup form
  app.get("/quiz-setup", isAuthenticated, (req, res) => {
    const categories = [
      { id: 9, name: "General Knowledge" },
      { id: 10, name: "Books" },
      { id: 11, name: "Film" },
      { id: 12, name: "Music" },
      { id: 21, name: "Sports" },
      { id: 25, name: "Art" },
      { id: 28, name: "Vehicles" },
      { id: 27, name: "Animals" },
      // Add more categories as needed
    ];
    res.render("quiz-setup.ejs", {
      categories,
      username: req.session.username,
    });
  });

  // Route to fetch quiz questions
  app.post("/generate-quiz", isAuthenticated, (req, res) => {
    const { amount, category, difficulty } = req.body;

    const apiUrl = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`;

    request(apiUrl, (error, response, body) => {
      if (error) {
        console.error("Error fetching quiz data:", error.message);
        req.flash(
          "error",
          "Failed to fetch quiz data. Please check your internet connection or try again later."
        );
        return res.redirect("/usr/293/quiz-setup");
      }

      const apiResponse = JSON.parse(body);

      if (apiResponse.response_code !== 0) {
        req.flash(
          "error",
          "No questions available for the selected options. Please try different settings."
        );
        return res.redirect("/usr/293/quiz-setup");
      }

      const quizData = apiResponse.results.map((q) => ({
        question: he.decode(q.question),
        correctAnswer: he.decode(q.correct_answer),
        incorrectAnswers: q.incorrect_answers.map((ans) => he.decode(ans)),
      }));

      const userId = req.session.userId;
      const title = `Quiz (${
        categoryMap[category] || "Unknown Category"
      }, ${difficulty}, ${amount} Questions)`;

      // Begin transaction
      db.beginTransaction((err) => {
        if (err) {
          console.error("Transaction Error:", err.message);
          req.flash("error", "An error occurred. Please try again.");
          return res.redirect("/usr/293/quiz-setup");
        }

        // Use stored procedure to create a quiz
        db.query(
          "CALL sp_add_quiz(?, ?, ?, ?, ?)",
          [title, category, difficulty, amount, userId],
          (err, results) => {
            if (err) {
              return db.rollback(() => {
                console.error("Error saving quiz:", err.message);
                req.flash("error", "Failed to save the quiz.");
                res.redirect("/usr/293/quiz-setup");
              });
            }

            // Access the first result set returned by the procedure
            const quizId = results[0][0]?.quiz_id;
            if (!quizId) {
              return db.rollback(() => {
                console.error("Error: Quiz ID not returned by sp_add_quiz.");
                req.flash("error", "Failed to create the quiz.");
                res.redirect("/usr/293/quiz-setup");
              });
            }

            const questions = quizData.map((q) => [
              quizId,
              q.question,
              q.correctAnswer,
              JSON.stringify(q.incorrectAnswers),
            ]);

            db.query(
              "INSERT INTO QUIZ_QUESTIONS (quiz_id, question, correct_answer, incorrect_answers) VALUES ?",
              [questions],
              (err) => {
                if (err) {
                  return db.rollback(() => {
                    console.error("Error saving questions:", err.message);
                    req.flash("error", "Failed to save quiz questions.");
                    res.redirect("/usr/293/quiz-setup");
                  });
                }

                db.commit((err) => {
                  if (err) {
                    return db.rollback(() => {
                      console.error("Commit Error:", err.message);
                      req.flash(
                        "error",
                        "An error occurred. Please try again."
                      );
                      res.redirect("/usr/293/quiz-setup");
                    });
                  }

                  req.session.quizData = quizData;
                  req.flash("success", "Quiz successfully created!");
                  res.redirect("/usr/293/");
                });
              }
            );
          }
        );
      });
    });
  });

  const he = require("he"); // Import the library

  app.get("/quiz/:id", isAuthenticated, (req, res) => {
    const quizId = req.params.id;

    // Set the current quiz ID in the session
    req.session.currentQuizId = quizId;

    // Call the stored procedure to fetch quiz details and questions
    db.query("CALL sp_get_quiz_details(?)", [quizId], (err, results) => {
      if (err) {
        console.error("Error fetching quiz:", err.message);
        req.flash("error", "Failed to load the quiz. Please try again.");
        return res.redirect("/usr/293/");
      }

      // Check if the quiz exists
      const quizRows = results[0];
      if (!quizRows || quizRows.length === 0) {
        req.flash("error", "Quiz not found.");
        return res.redirect("/usr/293/");
      }

      // Decode and format the questions
      const quizData = quizRows.map((row) => ({
        question: row.question,
        correctAnswer: row.correct_answer,
        incorrectAnswers: JSON.parse(row.incorrect_answers), // Parse JSON to array
      }));

      const title = quizRows[0].title; // Quiz title

      // Store quiz data in session for later use
      req.session.quizData = quizData;

      // Render the quiz page
      res.render("quiz.ejs", {
        title,
        quizData,
        username: req.session.username,
        successMessage: req.flash("success"),
        errorMessage: req.flash("error"),
      });
    });
  });

  // Route to handle quiz submission and score calculation
  app.post("/quiz-result", isAuthenticated, (req, res) => {
    const userAnswers = req.body.answers; // Submitted answers
    const quizData = req.session.quizData; // Quiz data from session
    const userId = req.session.userId;

    if (!quizData) {
      req.flash("error", "No quiz data found. Please generate a quiz first.");
      return res.redirect("/usr/293/quiz-setup");
    }

    let score = 0;

    // Compare answers
    // Compare answers
    quizData.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        score++;
      }
    });

    // Begin transaction
    db.beginTransaction((err) => {
      if (err) {
        console.error("Transaction Error:", err.message);
        req.flash("error", "An error occurred. Please try again.");
        return res.redirect("/usr/293/");
      }

      // Call stored procedure to update user's score
      db.query("CALL sp_update_user_score(?, ?)", [userId, score], (err) => {
        if (err) {
          return db.rollback(() => {
            console.error("Error updating user score:", err.message);
            req.flash("error", "Failed to update your score.");
            res.redirect("/usr/293/");
          });
        }

        // Call stored procedure to sync leaderboard
        db.query("CALL sp_sync_leaderboard(?, ?)", [userId, score], (err) => {
          if (err) {
            return db.rollback(() => {
              console.error("Error updating leaderboard:", err.message);
              req.flash("error", "Failed to update the leaderboard.");
              res.redirect("/usr/293/");
            });
          }

          // Commit transaction
          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                console.error("Commit Error:", err.message);
                req.flash("error", "An error occurred. Please try again.");
                res.redirect("/usr/293/");
              });
            }

            // Clear session quiz data
            delete req.session.quizData;

            // Show quiz results
            req.flash("success", `You scored ${score} points!`);
            res.render("quiz-result.ejs", {
              score,
              total: quizData.length,
              username: req.session.username,
            });
          });
        });
      });
    });
  });

  // Helper function to calculate score and render results
  function calculateAndRenderResults(req, res, userAnswers, quizData) {
    let score = 0;

    // Compare user answers with correct answers
    quizData.forEach((question, index) => {
      const userAnswer = (userAnswers[index] || "").trim().toLowerCase();
      const correctAnswer = question.correctAnswer.trim().toLowerCase();
      if (userAnswer === correctAnswer) {
        score++;
      }
    });

    // Clear session data for the quiz
    delete req.session.quizData;
    delete req.session.currentQuizId;

    // Render the results
    res.render("quiz-result.ejs", {
      score,
      total: quizData.length,
      username: req.session.username,
    });
  }

  app.get("/search", isAuthenticated, (req, res) => {
    const { category } = req.query;

    if (!category) {
        req.flash("error", "Please enter a category to search.");
        return res.redirect("/usr/293/");
    }

    const searchTerm = `%${category.toLowerCase()}%`; // Use SQL wildcard for partial match
    const userId = req.session.userId; // Fetch user ID from session

    // Fetch leaderboard data (top 5 users by score)
    db.query("CALL sp_get_leaderboard()", (err, leaderboardResults) => {
        if (err) {
            console.error("Error fetching leaderboard:", err.message);
            req.flash("error", "Failed to fetch leaderboard data.");
            return res.redirect("/usr/293/");
        }

        const leaderboard = leaderboardResults[0]; // The first result set contains leaderboard data

        // Query the database for quizzes matching the category name
        db.query("CALL sp_search_quizzes(?)", [searchTerm], (err, quizResults) => {
            if (err) {
                console.error("Error fetching quizzes:", err.message);
                req.flash("error", "Failed to fetch quizzes. Please try again.");
                return res.redirect("/usr/293/");
            }

            const quizzes = quizResults[0]; // The first result set contains the quizzes data

            // Fetch the user's score
            db.query("SELECT score FROM USERS WHERE user_id = ?", [userId], (err, userScoreResults) => {
                if (err) {
                    console.error("Error fetching user score:", err.message);
                    req.flash("error", "Failed to fetch user score.");
                    return res.redirect("/usr/293/");
                }

                const userScore = userScoreResults.length > 0 ? userScoreResults[0].score : 0;
                const successMessage = req.flash("success");
                const errorMessage = req.flash("error");
                const username = req.session.username || null;

                if (!quizzes || quizzes.length === 0) {
                    req.flash("error", `No quizzes found matching "${category}".`);
                    return res.redirect("/usr/293/");
                }

                // Render the index page with quizzes, leaderboard, and user score
                res.render("index.ejs", {
                    quizzes,
                    leaderboard,
                    successMessage,
                    errorMessage,
                    username,
                    userScore
                });
            });
        });
    });
});

};
