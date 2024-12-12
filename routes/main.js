module.exports = function(app) {

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
      res.redirect("/login");
    }

  };

    // Handle our routes
    app.get("/", isAuthenticated, (req, res) => {
        db.query(
            "SELECT QUIZZES.quiz_id, QUIZZES.title, QUIZZES.created_at, USERS.username AS created_by FROM QUIZZES JOIN USERS ON QUIZZES.created_by = USERS.user_id ORDER BY QUIZZES.created_at DESC",
            (err, quizzes) => {
                if (err) {
                    console.error("Error fetching quizzes:", err.message);
                    req.flash("error", "Failed to fetch quizzes. Please try again.");
                    return res.render("index.ejs", { quizzes: [], successMessage: null, errorMessage: req.flash("error") });
                }
    
                const successMessage = req.flash("success");
                const errorMessage = req.flash("error");
                const username = req.session.username || null; // Retrieve the username from the session
                res.render("index.ejs", { quizzes, successMessage, errorMessage, username });
            }
        );
    });

    app.get("/about", isAuthenticated, (req, res) => {
        const successMessage = req.flash("success");
        const errorMessage = req.flash("error");
        const username = req.session.username || null; // Pass username if logged in
    
        res.render("about.ejs", { successMessage, errorMessage, username });
    });

    // Login page
    app.get('/login', (req, res) => {
        const successMessage = req.flash("success")
        const errorMessage = req.flash("error")
        res.render("login.ejs", { successMessage, errorMessage });
    });

    app.post("/login", async (req, res) => {
        const { email, password } = req.body;
    
        try {
            // Retrieve user data from the database
            db.query("SELECT * FROM USERS WHERE email = ?", [email], async (error, results) => {
                if (error) {
                    console.error("Database Error:", error);
                    req.flash("error", "Internal Server Error");
                    return res.redirect("/login");
                }
    
                if (results.length > 0) {
                    const hashedPassword = results[0].password;
    
                    // Compare the provided password with the hashed password
                    const match = await bcrypt.compare(password, hashedPassword);
    
                    if (match) {
                        req.session.userId = results[0].user_id; // Save user ID in session
                        req.session.username = results[0].username; // Store username in session
                        req.flash("success", "Login successful!");
                        return res.redirect("/");
                    } else {
                        req.flash("error", "Incorrect email or password!");
                        return res.redirect("/login");
                    }
                } else {
                    req.flash("error", "Incorrect email or password!");
                    return res.redirect("/login");
                }
            });
        } catch (err) {
            console.error("Error during login:", err);
            req.flash("error", "An error occurred while logging in.");
            res.redirect("/login");
        }
    });
  

    // Register page
    app.get('/register', function (req,res) {
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
        return res.redirect("/register");
    }

    try {
        // Hashing the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = { username, email, password: hashedPassword };

        // Insert the user into the database
        db.query("INSERT INTO USERS SET ?", newUser, (error) => {
            if (error) {
                if (error.code === "ER_DUP_ENTRY") {
                    req.flash("error", "Username or email already exists!");
                } else {
                    console.error("Database Error:", error);
                    req.flash("error", "An error occurred while registering.");
                }
                return res.redirect("/register");
            }

            req.flash("success", "Registration successful! Please log in.");
            return res.redirect("/login");
        });
    } catch (err) {
        console.error("Hashing Error:", err);
        req.flash("error", "An error occurred while processing your registration.");
        res.redirect("/register");
    }
});

    //Logout route
    app.get("/logout", isAuthenticated, (req, res) => {
        req.session.destroy((err) => {
          if (err) {
            console.error(err);
            res.redirect("/");
          } else {
            console.log("Logged out successfully!");
            res.redirect("/login");
          }
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
        res.render("quiz-setup.ejs", { categories, username: req.session.username });
    });

    // Route to fetch quiz questions
    app.post("/generate-quiz", isAuthenticated, (req, res) => {
        const { amount, category, difficulty } = req.body; // Ensure 'difficulty' is captured
    
        const apiUrl = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`;
    
        request(apiUrl, (error, response, body) => {
            if (error) {
                console.error("Error fetching quiz data:", error.message);
                req.flash(
                    "error",
                    "Failed to fetch quiz data. Please check your internet connection or try again later."
                );
                return res.redirect("/quiz-setup");
            }
    
            const apiResponse = JSON.parse(body);
    
            if (apiResponse.response_code !== 0) {
                req.flash(
                    "error",
                    "No questions available for the selected options. Please try different settings."
                );
                return res.redirect("/quiz-setup");
            }
    
            const quizData = apiResponse.results.map((q) => ({
                question: he.decode(q.question),
                correctAnswer: he.decode(q.correct_answer),
                incorrectAnswers: q.incorrect_answers.map((ans) => he.decode(ans)),
            }));
    
            const userId = req.session.userId;
    
            const title = `Quiz (${categoryMap[category] || "Unknown Category"}, ${difficulty}, ${amount} Questions)`;

    
            db.query(
                "INSERT INTO QUIZZES (title, category, difficulty, num_questions, created_by) VALUES (?, ?, ?, ?, ?)",
                [title, category, difficulty, amount, userId],
                (err, results) => {
                    if (err) {
                        console.error("Error saving quiz:", err.message);
                        req.flash("error", "Failed to save the quiz. Please try again.");
                        return res.redirect("/quiz-setup");
                    }
    
                    const quizId = results.insertId;
    
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
                                console.error("Error saving questions:", err.message);
                                req.flash("error", "Failed to save quiz questions.");
                                return res.redirect("/quiz-setup");
                            }
    
                            req.session.quizData = quizData;
                            req.flash("success", "Quiz successfully created!");
                            res.redirect("/");
                        }
                    );
                }
            );
        });
    });

    const he = require("he"); // Import the library

    
    

    // Route for viewing the quiz
    app.get("/quiz/:id", isAuthenticated, (req, res) => {
        const quizId = req.params.id;
    
        // Set the current quiz ID in the session
        req.session.currentQuizId = quizId;
    
        db.query(
            `SELECT QUIZZES.title, QUIZ_QUESTIONS.question, QUIZ_QUESTIONS.correct_answer, QUIZ_QUESTIONS.incorrect_answers
             FROM QUIZZES
             JOIN QUIZ_QUESTIONS ON QUIZZES.quiz_id = QUIZ_QUESTIONS.quiz_id
             WHERE QUIZZES.quiz_id = ?`,
            [quizId],
            (err, results) => {
                if (err) {
                    console.error("Error fetching quiz:", err.message);
                    req.flash("error", "Failed to load the quiz. Please try again.");
                    return res.redirect("/");
                }
    
                if (results.length === 0) {
                    req.flash("error", "Quiz not found.");
                    return res.redirect("/");
                }
    
                // Decode and format the questions
                const quizData = results.map((row) => ({
                    question: row.question,
                    correctAnswer: row.correct_answer,
                    incorrectAnswers: JSON.parse(row.incorrect_answers), // Parse JSON to array
                }));
    
                const title = results[0].title;
    
                // Store quiz data in session for later use
                req.session.quizData = quizData;
    
                res.render("quiz.ejs", {
                    title,
                    quizData,
                    username: req.session.username,
                    successMessage: req.flash("success"),
                    errorMessage: req.flash("error"),
                });
            }
        );
    });
    
    
    
    
    
    // Route to handle quiz submission and score calculation
    app.post("/quiz-result", isAuthenticated, (req, res) => {
        const userAnswers = req.body.answers; // Retrieve user-submitted answers
        const quizId = req.session.currentQuizId; // Retrieve the quiz ID from the session
    
        if (!quizId) {
            req.flash("error", "No quiz selected. Please choose a quiz first.");
            return res.redirect("/");
        }
    
        // Retrieve quiz data from session or database
        const quizData = req.session.quizData || [];
        if (quizData.length === 0) {
            db.query(
                `SELECT question, correct_answer, incorrect_answers
                 FROM QUIZ_QUESTIONS
                 WHERE quiz_id = ?`,
                [quizId],
                (err, results) => {
                    if (err || results.length === 0) {
                        console.error("Error fetching quiz questions:", err);
                        req.flash("error", "Failed to load quiz questions. Please try again.");
                        return res.redirect("/");
                    }
    
                    // Format fetched data
                    const fetchedQuizData = results.map((row) => ({
                        question: row.question,
                        correctAnswer: row.correct_answer,
                        incorrectAnswers: JSON.parse(row.incorrect_answers),
                    }));
    
                    // Calculate and render the results
                    calculateAndRenderResults(req, res, userAnswers, fetchedQuizData);
                }
            );
        } else {
            // Use session data
            calculateAndRenderResults(req, res, userAnswers, quizData);
        }
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
            return res.redirect("/");
        }
    
        const searchTerm = `%${category.toLowerCase()}%`; // Use SQL wildcard for partial match
    
        // Query the database for quizzes matching the category name
        db.query(
            `SELECT QUIZZES.quiz_id, QUIZZES.title, QUIZZES.created_at, USERS.username AS created_by, CATEGORIES.name AS category_name
             FROM QUIZZES
             JOIN USERS ON QUIZZES.created_by = USERS.user_id
             JOIN CATEGORIES ON QUIZZES.category = CATEGORIES.category_id
             WHERE LOWER(CATEGORIES.name) LIKE ? 
             ORDER BY QUIZZES.created_at DESC`,
            [searchTerm],
            (err, quizzes) => {
                if (err) {
                    console.error("Error fetching quizzes:", err.message);
                    req.flash("error", "Failed to fetch quizzes. Please try again.");
                    return res.redirect("/");
                }
    
                const successMessage = req.flash("success");
                const errorMessage = req.flash("error");
                const username = req.session.username || null;
    
                if (quizzes.length === 0) {
                    req.flash("error", `No quizzes found matching "${category}".`);
                    return res.redirect("/");
                }
    
                res.render("index.ejs", {
                    quizzes,
                    successMessage,
                    errorMessage,
                    username,
                });
            }
        );
    });
    
};
