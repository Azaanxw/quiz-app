module.exports = function(app) {

    // Handle our routes
    app.get('/',function(req,res){
        res.render('index.ejs')
    });
    app.get('/about',function(req,res){
        res.render('about.ejs');
    });
    app.get('/login',function(req,res){
        res.render("login.ejs");
    });
    app.get('/register', function (req,res) {
        res.render('register.ejs');                                                                     
    });                                                                                                 

}