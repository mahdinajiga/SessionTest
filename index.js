var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var session = require('express-session');
var cookieParser = require('cookie-parser');
var MemcachedStore = require('connect-memcached')(session);
var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    passwordConf: {
        type: String,
        required: true,
    }
});
var User = mongoose.model('User', UserSchema);
module.exports = User;

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());
app.use(cookieParser());
app.use(session({
    secret: 'E7V49SX1CSV68DFS79TG46E5T3DSG1G3',
    key: 'user_sid',
    proxy: 'true',
    store: new MemcachedStore({
        hosts: ['127.0.0.1:11211'], //this should be where your Memcached server is running
        secret: '79DSSEE6V37V49G1GG468DX1CFS5T3ST' // Optionally use transparent encryption for memcache session data 
    })
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
            /*
            Users.filter(function (user) {
                if (user.id === req.body.id) {
                    res.render('signup', {
                        message: "User Already Exists! Login or choose another user id"
                    });
                }
            });
            var newUser = { id: req.body.id, password: req.body.password };
            Users.push(newUser);
            
            var userData = {
                email: "info@mahdinaji.com",
                username: req.body.id,
                password: req.body.password,
                passwordConf: req.body.password,
            }*/
            var newUser = new User({email: "info@mahdinaji.com",
                username: req.body.id,
                password: req.body.password,
                passwordConf: req.body.password
            });
            console.log("UserAdding");
            newUser.save(function (err,User) {
                if(err)
                {
                    res.render('signup', {message: "Database error"});
                }
                else
                {
                    console.log("UserAdded");
                    req.session.user = userData;
                    res.redirect('/protected_page');
                }
            });
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

            User.find({username : req.body.id},function (err,res) {
                if(err)
                {
                    console.log(err);
                } 
                else
                {
                    res.forEach(element => {
                        if(element.password == req.body.password)
                        {
                            req.session.user = user;
                            res.redirect('/protected_page');
                        }                        
                    });
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