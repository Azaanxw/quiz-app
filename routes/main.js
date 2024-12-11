module.exports = function(app) {

    //Password hashing setup
    const bcrypt = require("bcrypt"); 
    const saltRounds = 10; // Number of salt rounds for hashing
    

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
        const successMessage = req.flash("success");
        const errorMessage = req.flash("error");
        const username = req.session.username || null; // Pass username if logged in
    
        res.render("index.ejs", { successMessage, errorMessage, username });
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
            db.query("SELECT * FROM user WHERE email = ?", [email], async (error, results) => {
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
        db.query("INSERT INTO user SET ?", newUser, (error) => {
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
        const { amount, category, difficulty } = req.body;
        const apiUrl = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`;

        request(apiUrl, { json: true }, (err, response, body) => {
            if (err) {
                console.error("Error fetching quiz data:", err);
                req.flash("error", "Failed to generate quiz. Please try again.");
                return res.redirect("/quiz-setup");
            }

            if (body.response_code !== 0) {
                req.flash("error", "No questions available for the selected options. Try again.");
                return res.redirect("/quiz-setup");
            }

            req.session.quizData = body.results; // Save quiz data in session
            res.redirect("/quiz");
        });
    });

    const he = require("he"); // Import the library

    app.get("/quiz", isAuthenticated, (req, res) => {
        const quizData = req.session.quizData;
        if (!quizData) {
            req.flash("error", "No quiz data found. Please generate a quiz first.");
            return res.redirect("/quiz-setup");
        }
    
        // Decode HTML entities in questions and answers
        const decodedQuizData = quizData.map((question) => ({
            ...question,
            question: he.decode(question.question),
            correct_answer: he.decode(question.correct_answer),
            incorrect_answers: question.incorrect_answers.map((answer) => he.decode(answer)),
        }));
    
        res.render("quiz.ejs", { quizData: decodedQuizData, username: req.session.username });
    });
    
    // Route to handle quiz submission and score calculation
    app.post("/quiz-result", isAuthenticated, (req, res) => {
        const userAnswers = req.body.answers;
        const quizData = req.session.quizData;

        let score = 0;
        quizData.forEach((question, index) => {
            if (userAnswers[index] === question.correct_answer) {
                score++;
            }
        });

        res.render("quiz-result.ejs", { score, total: quizData.length, username: req.session.username });
    });

};
