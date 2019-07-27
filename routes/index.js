const express = require('express');
const passport = require('passport');
const User = require('../models/user');

const router = express.Router();

// Landing route
router.get('/', (req, res) => {
  res.render('landing');
});

// ==================
// Auth routes
// ==================

// Show register form
router.get('/register', (req, res) => {
  res.render('register');
});

// Handle sign up logic
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  User.register(new User({ username }), password, () => {
    passport.authenticate('local')(req, res, () => {
      res.redirect('/campgrounds');
    });
  });
});

// Show login form
router.get('/login', (req, res) => {
  res.render('login');
});

// Handle the login logic
router.post('/login', passport.authenticate('local',
  {
    successRedirect: '/campgrounds',
    failureRedirect: '/login',
  }), () => {
});

// Logout route
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/campgrounds');
});

module.exports = router;
