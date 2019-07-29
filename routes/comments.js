/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const express = require('express');
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware')

const router = express.Router({ mergeParams: true });

// New route
router.get('/new', middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    res.render('comments/new', { campground });
  });
});

// Create route
router.post('/', middleware.isLoggedIn, (req, res) => {
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

// Edit route
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    Comment.findById(req.params.comment_id, (err, comment) => {
      res.render('comments/edit', {
        campground,
        comment,
      });
    });
  });
});

// Update route
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(
    req.params.comment_id, req.body.comment,
    (err, comment) => {
      res.redirect(`/campgrounds/${req.params.id}`);
    });
});

// Delete route
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  const { id, comment_id } = req.params;
  Comment.findByIdAndRemove(comment_id, (err, comment) => {
    Campground.findById(id, (err, campground) => {
      campground.comments.remove(comment_id);
      campground.save();
      res.redirect(`/campgrounds/${id}`);
    });
  });
});

module.exports = router;
