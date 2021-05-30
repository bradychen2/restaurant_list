const Restaurant = require('../models/restaurant')

const restaurantController = {
  getRestaurants: async (req, res) => {
    const userId = req.user._id

    try {
      const restaurants = await Restaurant
        .find({ userId }).lean().sort({ _id: 'asc' })

      res.render('index', { restaurants, stylesheet: 'index' })
    } catch (err) {
      console.log(err)
    }
  },

  getRestaurant: async (req, res) => {
    const userId = req.user._id
    const _id = req.params.id

    try {
      let restaurant = await Restaurant
        .findOne({ _id, userId }).lean()

      res.render('show', { restaurant, stylesheet: 'show' })
    } catch (err) {
      console.log(err)
    }
  },

  getCreateRestaurant: (req, res) => {
    res.render('new', { stylesheet: 'new' })
  },

  postRestaurant: async (req, res) => {
    const userId = req.user._id
    const {
      name, name_en, category, rating,
      location, phone, google_map,
      image, description
    } = req.body

    try {
      await Restaurant.create(
        {
          name, name_en, category, rating,
          location, phone, google_map,
          image, description, userId
        })

      res.redirect('/')
    } catch (err) {
      console.log(err)
    }
  },

  getEditRestaurant: async (req, res) => {
    const userId = req.user._id
    const _id = req.params.id

    try {
      const restaurant = await Restaurant
        .findOne({ _id, userId }).lean()

      res.render('edit', { restaurant, stylesheet: 'edit' })
    } catch (err) {
      console.log(err)
    }
  },

  putRestaurant: async (req, res) => {
    const userId = req.user._id
    const _id = req.params.id

    try {
      let restaurant = await Restaurant.findOne({ _id, userId })
      restaurant = Object.assign(restaurant, req.body)
      await restaurant.save()

      res.redirect(`/restaurants/${_id}`)
    } catch (err) {
      console.log(err)
    }
  },

  searchRestaurant: async (req, res) => {
    const userId = req.user._id
    const keyword = req.query.keyword
    const reg = new RegExp(keyword, 'i') // Not case-sensitive

    try {
      const restaurants = await Restaurant.find({
        $and: [
          { userId },
          {
            $or: [{ name: { $regex: reg } },
            { name_en: { $regex: reg } },
            { category: { $regex: reg } }]
          }
        ]
      }).lean()
      res.render('index', { restaurants, stylesheet: 'index' })
    } catch (err) {
      console.log(err)
    }
  },

  deleteRestaurant: async (req, res) => {
    const userId = req.user._id
    const _id = req.params.id
    try {
      const restaurant = await Restaurant.findOne({ _id, userId })
      await restaurant.remove()
      res.redirect('/')
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = restaurantController