const Restaurant = require('../models/restaurant')

const restaurantController = {
  getRestaurants: (req, res) => {
    userId = req.user._id
    Restaurant.find({ userId })
      .lean()
      .sort({ _id: 'asc' })
      .then(restaurants => {
        res.render('index', { restaurants, stylesheet: 'index' })
      })
      .catch(error => console.log(error))
  },

  getRestaurant: (req, res) => {
    const userId = req.user._id
    const _id = req.params.id
    return Restaurant.findOne({ _id, userId })
      .lean()
      .then((restaurant) => res.render('show', { restaurant, stylesheet: 'show' }))
      .catch(error => console.log(error))
  },

  getCreateRestaurant: (req, res) => {
    res.render('new', { stylesheet: 'new' })
  },

  postRestaurant: (req, res) => {
    const userId = req.user._id
    const { name, name_en, category, rating,
      location, phone, google_map,
      image, description } = req.body

    return Restaurant.create({
      name, name_en, category, rating,
      location, phone, google_map,
      image, description, userId
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
  },

  getEditRestaurant: (req, res) => {
    const userId = req.user._id
    const _id = req.params.id
    return Restaurant.findOne({ _id, userId })
      .lean()
      .then((restaurant) => res.render('edit', { restaurant, stylesheet: 'edit' }))
      .catch(error => console.log(error))
  },

  putRestaurant: (req, res) => {
    const userId = req.user._id
    const _id = req.params.id
    return Restaurant.findOne({ _id, userId })
      .then((restaurant) => {
        restaurant = Object.assign(restaurant, req.body)
        return restaurant.save()
      })
      .then(() => res.redirect(`/restaurants/${_id}`))
      .catch(error => console.log(error))
  },

  searchRestaurant: (req, res) => {
    const userId = req.user._id
    const keyword = req.query.keyword
    const reg = new RegExp(keyword, 'i') // Not case-sensitive

    Restaurant.find({
      $and: [
        { userId },
        {
          $or: [
            { name: { $regex: reg } },
            { name_en: { $regex: reg } },
            { category: { $regex: reg } }
          ]
        }
      ]
    })
      .lean()
      .then(restaurant => res.render('index', { restaurants: restaurant, stylesheet: 'index' }))
      .catch(error => console.log(error))
  },

  deleteRestaurant: (req, res) => {
    const userId = req.user._id
    const _id = req.params.id
    return Restaurant.findOne({ _id, userId })
      .then(restaurant => restaurant.remove())
      .then(() => res.redirect('/'))
      .catch(error => console.log(error))
  }
}

module.exports = restaurantController