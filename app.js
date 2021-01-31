// import modules and files
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
require('./config/mongoose')
const Restaurant = require('./models/restaurant')

// set required constant for server
const app = express()
const port = 3000

// set template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// set static files
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// Go to Home Page
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .sort({ _id: 'asc' })
    .then(restaurant => {
      res.render('index', { restaurants: restaurant, stylesheet: 'index' })
    })
    .catch(error => console.log(error))
})

// Searching
app.get('/restaurants/search', (req, res) => {
  const keyword = req.query.keyword
  const reg = new RegExp(keyword, 'i') // Not case-sensitive
  Restaurant.find(
    {
      $or: [
        { name: { $regex: reg } }, { category: { $regex: reg } }
      ]
    }
  )
    .lean()
    .then(restaurant => res.render('index', { restaurants: restaurant, stylesheet: 'index' }))
    .catch(error => console.log(error))
})

// Go to create page
app.get('/restaurants/new', (req, res) => {
  res.render('new', { stylesheet: 'new' })
})

// Create new restaurant
app.post('/restaurants', (req, res) => {
  const restaurant = req.body
  console.log(restaurant)
  return Restaurant.create({
    name: restaurant.name,
    name_en: restaurant.name_en,
    category: restaurant.category,
    rating: restaurant.rating,
    location: restaurant.location,
    phone: restaurant.phone,
    google_map: restaurant.google_map,
    image: restaurant.image,
    description: restaurant.description
  })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// Show details
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('show', { restaurant, stylesheet: 'show' }))
    .catch(error => console.log(error))
})

// Go to edit
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant, stylesheet: 'edit' }))
    .catch(error => console.log(error))
})

// Send edit form
app.put('/restaurants/:id', (req, res) => {
  const id = req.params.id

  return Restaurant.findById(id)
    .then((restaurant) => {

      restaurant = Object.assign(restaurant, req.body)
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

// Delete restaurant
app.delete('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// server listening
app.listen(port, () => {
  console.log(`Express server is listening on http://localhost:${port}`)
})