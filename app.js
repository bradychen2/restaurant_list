// import modules and files
const express = require('express')
const exphbs = require('express-handlebars')
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

// route setting for showing details
app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant_id = req.params.restaurant_id
  const restaurant = restaurantList.results.find(restaurant => restaurant.id.toString() === restaurant_id)
  res.render('show', { restaurant: restaurant, stylesheet: 'show' })
})

// route setting for search
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const restaurants = restaurantList.results.filter(restaurant => {
    // accept searching with names or categories
    return restaurant.name.toLowerCase().includes(keyword.toLowerCase()) ||
      restaurant.category.toLocaleLowerCase().includes(keyword.toLowerCase())
  })

  res.render('index', { restaurants: restaurants, keyword: keyword, stylesheet: 'index' })
})

// Go to create page
app.get('/restaurant/new', (req, res) => {
  res.render('new', { stylesheet: 'new' })
})

// Create new restaurant


// server listening
app.listen(port, () => {
  console.log(`Express server is listening on http://localhost:${port}`)
})