// Reuqire modules
var express = require ('express'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    exphbs = require('express-handlebars'),
    expressValidator = require('express-validator'),
    flash = require('connect-flash'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    mongo = require('mongodb'),
    mongoose = require('mongoose'),
    http = require('http').Server(app),
    io = require('socket.io')(http);

// Set db connection
mongoose.connect('mongodb://localhost/loginapp');
var db = mongoose.connection;

// include routes
var router = require('./routes/index');
var users  = require('./routes/users');


// Initialize Express app
var app = express();

//middleware for maintenance
app.use(function (req, res, next) {
    res.render('chat');
});

// Set view engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

// Body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Express session
app.use(session({
    secret: 'ggjkgqwkkegqw',
    resave: false,
    saveUninitialized: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

// Set connect flash
app.use(flash());

// Global variables for flash messages
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg'); // assign local variable to 'res.locals' and make it global
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null; // if user is logged will see 'logout' and 'dashboard',
                                        // if not - 'login' and 'register' pages,
                                        // This global is accessed in handlebars under the 'user'
    next();
});

// Make our routes accessible
app.use('/', router);
app.use('/users', users);


// Port - set and listen
app.set('port', (process.env.PORT || 3001));

app.listen(app.get('port'), function(){
    console.log('Server started on port '+app.get('port'));
});