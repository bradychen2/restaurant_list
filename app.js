// import modules and files
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
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

// route setting for index
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .sort({ _id: 'asc' })
    .then(restaurants => {
      res.render('index', { restaurants, stylesheet: 'index' })
    })
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

// route setting for showing details
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('show', { restaurant, stylesheet: 'show' }))
    .catch(error => console.log(error))
})

// route setting for search
// app.get('/search', (req, res) => {
//   const keyword = req.query.keyword
//   const restaurants = restaurantList.results.filter(restaurant => {
//     // accept searching with names or categories
//     return restaurant.name.toLowerCase().includes(keyword.toLowerCase()) ||
//       restaurant.category.toLocaleLowerCase().includes(keyword.toLowerCase())
//   })

//   res.render('index', { restaurants: restaurants, keyword: keyword, stylesheet: 'index' })
// })

// server listening
app.listen(port, () => {
  console.log(`Express server is listening on http://localhost:${port}`)
})