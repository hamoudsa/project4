const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const pgp = require('pg-promise')();
var database = require('./config');

var connection = {
    host: `${database.host}`,
    user: `${database.user}`,
    password: `${database.password}`,
    database: `${database.database}`,
    ssl: database.ssl
}

const db = pgp(connection);

module.exports = function (passport) {
    passport.use(
      new LocalStrategy(
        {
          usernameField: 'email',
          passwordField: 'password'
        }, (email, password, done) => {
          // Match user
          db.one(`Select * from users where email = '${email}'`)
          .then(user => {
            console.log(user);
            if (!user) {
                return done(null, false, { message: 'No User Found' });
              }
  
              // Match password
              bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                  return done(null, user);
                } else {
                  return done(null, false, { message: 'Password Incorrect' });
                }
              })
          }).catch(err => {
            console.log(err)
          })
        }));
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    db.one(`select * from users where id = ${id}`)
    .then(user => {
      done(null,user);
    })
  });
}
