const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

// Go to Home Page
router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .sort({ _id: 'asc' })
    .then(restaurant => {
      res.render('index', { restaurants: restaurant, stylesheet: 'index' })
    })
    .catch(error => console.log(error))
})

module.exports = router