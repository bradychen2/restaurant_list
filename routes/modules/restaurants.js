const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')
const mongoose = require('mongoose')

// Go to create page
router.get('/new', (req, res) => {
  res.render('new', { stylesheet: 'new' })
})

// Searching
router.get('/search', (req, res) => {
  const userId = req.user._id
  const keyword = req.query.keyword
  const reg = new RegExp(keyword, 'i') // Not case-sensitive
  Restaurant.find({
    $and: [{ userId }, { $or: [{ name: { $regex: reg } }, { category: { $regex: reg } }] }]
  })
    .lean()
    .then(restaurant => res.render('index', { restaurants: restaurant, stylesheet: 'index' }))
    .catch(error => console.log(error))
})


// Create new restaurant
router.post('/', (req, res) => {
  const userId = req.user._id
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
    description: restaurant.description,
    userId: userId
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
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then((restaurant) => res.render('show', { restaurant, stylesheet: 'show' }))
    .catch(error => console.log(error))
})

// Go to edit
router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then((restaurant) => res.render('edit', { restaurant, stylesheet: 'edit' }))
    .catch(error => console.log(error))
})

// Send edit form
router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .then((restaurant) => {

      restaurant = Object.assign(restaurant, req.body)
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

// Delete restaurant
router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router