const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true });

// Schema setup
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  desc: String,
});
const Campground = mongoose.model('Campground', campgroundSchema);

// Campground.create(
//   {
//     name: 'Lori',
//     image: 'https://rebrand.ly/4c117',
//   },
//   (err, campground) => {
//     if (err) {
//       console.log(`Error: ${err}`);
//     } else {
//       console.log('New Campground Created!');
//       console.log(campground);
//     }
//   },
// );

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/campgrounds', (req, res) => {
  // Get all campgrounds from DB
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render('index', { campgrounds });
    }
  });
});

app.post('/campgrounds', (req, res) => {
  // get data from form and add to campgrounds array
  const { name, image, desc } = req.body;
  const newCampground = { name, image, desc };
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

app.get('/campgrounds/new', (req, res) => {
  res.render('new');
});

app.get('/campgrounds/:id', (req, res) => {
  // Find the campground with provided ID
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('show', { campground });
    }
  });
  // Show detailed information about that campground
});

app.listen(3000, () => {
  console.log('The YelpCamp Server Has Started!');
});
