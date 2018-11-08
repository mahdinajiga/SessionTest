var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var session = require('express-session');
var cookieParser = require('cookie-parser');

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());
app.use(cookieParser());
app.use(session({
    secret: 'E7V49SX1CSV68DFS79TG46E5T3DSG1G3',
    key: 'user_sid'
}));



var Users = [];




app.get('/', function (req, res) {
    if (req.session.user) {
        res.render('index', { assigned: 1 });
    }
    else {
        res.render('index');
    }
});




app.get('/signup', function (req, res) {
    res.render('signup');
});

app.post('/signup', function (req, res) {
    if (req.session.user) {
        res.render('signup', { message: "User Already Exists! Login or choose another user id" });
    }
    else {
    if (!req.body.id || !req.body.password) {
        res.status("400");
        res.send("Invalid details!");
    } else {
        Users.filter(function (user) {
            if (user.id === req.body.id) {
                res.render('signup', {
                    message: "User Already Exists! Login or choose another user id"
                });
            }
        });
        var newUser = { id: req.body.id, password: req.body.password };
        Users.push(newUser);
        req.session.user = newUser;
        res.redirect('/protected_page');
    }
}
});







app.get('/login', function (req, res) {
    res.render('login');
});

app.post('/login', function (req, res) {
    //console.log(Users);
    if (req.session.user) {
        res.render('login', { message: "You've already logged in" });
    }
    else {
        if (!req.body.id || !req.body.password) {
            res.render('login', { message: "Please enter both id and password" });
        } else {
            Users.filter(function (user) {
                if (user.id === req.body.id && user.password === req.body.password) {
                    req.session.user = user;
                    res.redirect('/protected_page');
                }
            });
            res.render('login', { message: "Invalid credentials!" });
        }
    }
});

app.get('/protected_page', function (req, res) {
    if (req.session.user) {
        res.render('protected_page', { id: req.session.user.id });
    } else {
        res.render('protected_page');
    }
});

app.get('/logout', function (req, res) {
    req.session.destroy(function () {
        console.log("user logged out.")
    });
    res.redirect('/login');
});


app.listen(80);