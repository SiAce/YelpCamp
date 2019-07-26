const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user');
const seedDB = require('./seeds');

const app = express();

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.prevUrl = req.body.url;
  return res.redirect('/login');
}

mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true });
seedDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Passport configuration
app.use(require('express-session')({
  secret: 'Geralt',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Landing route
app.get('/', (req, res) => {
  res.render('landing');
});

// ====================
// Campgrounds routes
// ====================

// Index route
app.get('/campgrounds', (req, res) => {
  // Get all campgrounds from DB
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', { campgrounds });
    }
  });
});

// New route
app.get('/campgrounds/new', (req, res) => {
  res.render('camgrounds/new');
});

// Create route
app.post('/campgrounds', (req, res) => {
  // get data from form and add to campgrounds array
  const { name, image, description } = req.body;
  const newCampground = { name, image, description };
  // Create a new campground and save to database
  Campground.create(newCampground, (err) => {
    if (err) {
      console.log(err);
    } else {
      // redirect back to campgrounds page
      res.redirect('/campgrounds');
    }
  });
});

// Show route
app.get('/campgrounds/:id', (req, res) => {
  // Find the campground with provided ID
  Campground
    .findById(req.params.id)
    .populate('comments')
    .exec((err, campground) => {
      res.render('campgrounds/show', { campground });
    });
  // Show detailed information about that campground
});

// ====================
// Comments routes
// ====================

// New route
app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    res.render('comments/new', { campground });
  });
});

// Create route
app.post('/campgrounds/:id/comments', (req, res) => {
  Campground.findById(req.params.id, (campErr, campground) => {
    Comment.create(req.body.comment, (commentErr, comment) => {
      campground.comments.push(comment);
      campground.save();
      res.redirect(`/campgrounds/${req.params.id}`);
    });
  });
});

// ==================
// Auth routes
// ==================

// Show register form
app.get('/register', (req, res) => {
  res.render('register');
});

// Handle sign up logic
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  User.register(new User({ username }), password, () => {
    passport.authenticate('local')(req, res, () => {
      res.redirect('/campgrounds');
    });
  });
});

// Show login form
app.get('/login', (req, res) => {
  res.render('login');
});

// Handle the login logic
app.post('/login', passport.authenticate('local',
  {
    successRedirect: '/campgrounds',
    failureRedirect: '/login',
  }), () => {
});

// Logout route
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/campgrounds');
});

app.listen(3000, () => {
  console.log('The YelpCamp Server Has Started!');
});
