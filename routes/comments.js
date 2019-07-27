/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const express = require('express');
const Campground = require('../models/campground');
const Comment = require('../models/comment');

const router = express.Router({ mergeParams: true });

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/login');
}

// New route
router.get('/new', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    res.render('comments/new', { campground });
  });
});

// Create route
router.post('/', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (campErr, campground) => {
    Comment.create(req.body.comment, (commentErr, comment) => {
      comment.author.id = req.user._id;
      comment.author.username = req.user.username;
      comment.save();
      campground.comments.push(comment);
      campground.save();
      res.redirect(`/campgrounds/${req.params.id}`);
    });
  });
});

module.exports = router;
