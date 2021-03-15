const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

// Searching
router.get('/search', (req, res) => {
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
router.get('/new', (req, res) => {
  res.render('new', { stylesheet: 'new' })
})

// Create new restaurant
router.post('/', (req, res) => {
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
    .then(() =>
      res.redirect('/')
    )
    .catch(error => {
      console.log(error)
      if (error.name === 'ValidationError') {
        res.render('new', { restaurant, stylesheet: 'new', error })
      }
    })
})

// Show details
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('show', { restaurant, stylesheet: 'show' }))
    .catch(error => console.log(error))
})

// Go to edit
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant, stylesheet: 'edit' }))
    .catch(error => console.log(error))
})

// Send edit form
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router