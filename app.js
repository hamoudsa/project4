const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const pgp = require('pg-promise')();
const LocalStrategy = require('passport-local').Strategy;
var database = require('./db/config');

var connection = {
    host: `${database.host}`,
    user: `${database.user}`,
    password: `${database.password}`,
    database: `${database.database}`,
    ssl: database.ssl
}

const db = pgp(connection);

var Client = require('node-rest-client').Client;
var client = new Client();

const passport = require('passport');
require('./db/passport')(passport);
const app = express();
app.use(passport.initialize());
app.use(passport.session());
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.post('/getLocations', (req, res) => {
    const searchText = req.body.city;
    console.log(searchText);
    client.get("https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + searchText + "+top+sights&key=AIzaSyA1jA7nd60TgCZS4B7pKquBJYY5m9NfDKo", function (data, response) {
        console.log(data);
        res.json({ msg: true, data: data });
    });
})


app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});


app.post('/login', function (req, res, next) {
    /* look at the 2nd parameter to the below call */
    if (!req.body.password || !req.body.email) {
        res.json({
            "success": false,
            "error": "Please type your email and password"
        })
    }
    passport.authenticate('local', function (err, user, info) {
        if (err) { return next(err); }
        if (!user) {
            res.json({
                "success": false,
                "error": "Your email or password is incorrect"
            })
        }
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            return res.json({
                "success": true,
                "error": null,
                "data": user
            })
        });
    })(req, res, next);
});

// Register Form POST
app.post('/register', (req, res) => {
    let errors = [];

    if (!req.body.email) {
        errors.push('Email can\'t be empty');
    }

    if (!req.body.username) {
        errors.push('username can\'t be empty');
    }

    if (req.body.password.length < 4 || !req.body.password) {
        errors.push('Password must be at least 4 characters');
    }

    if (errors.length > 0) {
        res.json({
            "success": false,
            "error": errors,
            "data": [
                email = req.body.email
            ]
        })
    } else {
        db.any(`select * from users where email = '${req.body.email}'`)
            .then(user => {
                if (user.length > 0) {
                    res.json({
                        "success": false,
                        "error": "This email is already registered"
                    })
                } else {
                    var id = Math.floor(Math.random() * Math.floor(100000000));
                    var newUserMysql = new Object();

                    newUserMysql.email = req.body.email;
                    newUserMysql.username = req.body.username;
                    newUserMysql.password = req.body.password;
                    newUserMysql.id = id;

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUserMysql.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUserMysql.password = hash;
                            db.none(`INSERT INTO users ( id, username,email, password ) values (
                                '${id}',
                                '${req.body.username}',
                                '${req.body.email}',
                                '${newUserMysql.password}')`)
                                .then(() => {
                                    res.json({
                                        "success": true,
                                        "error": null,
                                        "msg": "user registered"
                                    })
                                })
                        });
                    });
                }
            })
            .catch(err => {
                console.log(err);
            })
    }
});

app.post('/saveplace', (req, res) => {
    db.none(`INSERT INTO places ( place_id, formatted_address, icon,name,rating,user_id ) Values (
        ${req.body.place_id}, 
        '${req.body.formatted_address}',
        '${req.body.icon}',
        '${req.body.name}',
        ${req.body.rating},
        ${req.body.user_id})`)
        .then(result => {
            console.log(result);
            res.json('done');
        })
        .catch(err => {
            console.log(err);
        })
})

app.delete('/deleteplace', (req, res) => {
    db.none(`delete from places where place_id = ${req.body.place_id}`)
    .then(() => {
        res.json('place deleted')
    })
    .catch(err => {
        console.log(err);
    })

})

app.get('/getplaces', (req, res) => {
    db.any(`select * from places where user_id = ${req.query.user_id}`)
    .then(places => {
        if(places.length < 1){
            res.json('No Places');
            return;
        }

        res.json(places);
    })
})

app.listen(3001, () => {
    console.log('Listening to 3001');
})

