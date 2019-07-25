const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const seedDB = require('./seeds');

const app = express();

mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true });
seedDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

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
app.get('/campgrounds/:id/comments/new', (req, res) => {
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

app.listen(3000, () => {
  console.log('The YelpCamp Server Has Started!');
});
