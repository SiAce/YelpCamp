const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const User = require('./models/user');
// const seedDB = require('./seeds');

const campgroundRoute = require('./routes/campgrounds');
const commentRoute = require('./routes/comments');
const indexRoutes = require('./routes/index');

const app = express();

mongoose.connect(process.env.DATABASEURL || 'mongodb://localhost:27017/yelp_camp',
  {
    useNewUrlParser: true,
    useCreateIndex: true,
  });

// seedDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(flash());
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
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use(indexRoutes);
app.use('/campgrounds', campgroundRoute);
app.use('/campgrounds/:id/comments', commentRoute);

app.listen(process.env.PORT || 3000, process.env.IP, () => {
  console.log('Server is running');
});
