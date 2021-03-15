const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

// Go to Home Page
router.get('/', (req, res) => {
  userId = req.user._id
  Restaurant.find({ userId })
    .lean()
    .sort({ _id: 'asc' })
    .then(restaurants => {
      res.render('index', { restaurants, stylesheet: 'index' })
    })
    .catch(error => console.log(error))
})

module.exports = router