/* eslint-disable no-underscore-dangle */
const express = require('express');
const Campground = require('../models/campground');
const Comment = require('../models/comment');

const router = express.Router();

// Middlewares
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/login');
}

function checkCampgroundOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, campground) => {
      if (campground.author.id.equals(req.user._id)) {
        next();
      } else {
        res.redirect('back');
      }
    });
  } else {
    res.redirect('back');
  }
}

// Index route
router.get('/', (req, res) => {
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
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

// Create route
router.post('/', isLoggedIn, (req, res) => {
  // get data from form and add to campgrounds array
  const { name, image, description } = req.body;
  const author = {
    id: req.user._id,
    username: req.user.username,
  };
  const newCampground = {
    name,
    image,
    description,
    author,
  };
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
router.get('/:id', (req, res) => {
  // Find the campground with provided ID
  Campground
    .findById(req.params.id)
    .populate('comments')
    .exec((err, campground) => {
      res.render('campgrounds/show', { campground });
    });
  // Show detailed information about that campground
});

// Edit route
router.get('/:id/edit', checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    res.render('campgrounds/edit', { campground });
  });
});

// Update route
router.put('/:id', checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, () => {
    res.redirect(`/campgrounds/${req.params.id}`);
  });
});

// Delete route
router.delete('/:id', checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, (err, campground) => {
    Comment.deleteMany({ _id: { $in: campground.comments } }, () => {
      res.redirect('/campgrounds');
    });
  });
});

module.exports = router;
