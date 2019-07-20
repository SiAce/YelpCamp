const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const campgrounds = [
  { name: 'Lori', image: 'https://www.reserveamerica.com/webphotos/racms/articles/images/bca19684-d902-422d-8de2-f083e77b50ff_image2_GettyImages-677064730.jpg' },
  { name: 'Gala', image: 'https://www.michigan.org/sites/default/files/styles/15_6_desktop/public/camping-hero_0_0.jpg?itok=mgGs0-vw&timestamp=1520373602' },
  { name: 'Ashito', image: 'https://www.newzealand.com/assets/Tourism-NZ/Nelson/ba40378fe9/img-1536928144-4748-13836-F53C3949-ED9E-E0DC-CF6EC0D789D9308A__FocalPointCropWzI0MCw0ODAsNTAsNTAsNzUsImpwZyIsNjUsMi41XQ.jpg' },
];

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/campgrounds', (req, res) => {
  res.render('campgrounds', { campgrounds });
});

app.post('/campgrounds', (req, res) => {
  // get data from form and add to campgrounds array
  const { name, image } = req.body;
  const newCampground = { name, image };
  campgrounds.push(newCampground);
  // redirect back to campgrounds page
  res.redirect('/campgrounds');
});

app.get('/campgrounds/new', (req, res) => {
  res.render('new');
});

app.listen(3000, () => {
  console.log('The YelpCamp Server Has Started!');
});
