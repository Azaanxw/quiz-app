// Modules
var express = require ('express')
var ejs = require('ejs')
var mysql = require('mysql2')
var bodyParser = require("body-parser");
var session = require('express-session');
var crypto = require('crypto');
var flash = require("connect-flash");
// Load environment variables from .env file
require('dotenv').config();

// Create the express application object
const app = express()
const port = 8000
app.use(bodyParser.urlencoded({ extended: true }))

// Creates the classified session
var secretSessionKey = crypto.randomBytes(40).toString("hex");

//Setup session 
app.use(session({
    secret: secretSessionKey, // Dynamically generated secret key
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 900000  // 15 minutes until session expires
    }
}));

// Flash middleware setup
app.use(flash());


// Define the database connection
const db = mysql.createConnection ({
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_name
});
// Connect to the database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;


// Set up css
app.use(express.static(__dirname + '/public'));


// Set the directory where Express will pick up HTML files
// __dirname will get the current directory
app.set('views', __dirname + '/views');

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs');

// Tells Express how we should process html files
// We want to use EJS's rendering engine
app.engine('html', ejs.renderFile);

// Requires the main.js file inside the routes folder passing in the Express app and data as arguments
require("./routes/main")(app);

console.log(`Session Secret Key: ${secretSessionKey}`);
// Start the web app listening
app.listen(port, () => console.log(`Example app listening on port ${port}!`))