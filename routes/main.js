module.exports = function(app) {

    //Password hashing setup
    const bcrypt = require("bcrypt"); 
    const saltRounds = 10; // Number of salt rounds for hashing

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
    app.get('/', isAuthenticated,function(req,res){
        const successMessage = req.flash("success");
        const errorMessage = req.flash("error");

        res.render("index.ejs", { successMessage, errorMessage });
    });
    app.get('/about', isAuthenticated,function(req,res){
        res.render('about.ejs');
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
};
