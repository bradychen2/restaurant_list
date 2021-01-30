const db = require('../../config/mongoose')
const Restaurant = require('../restaurant')
const restaurantCollection = require('./restaurant.json')
const restaurantList = restaurantCollection.results

db.once('open', () => {
  for (let i in restaurantList) {
    Restaurant.create({
      name: restaurantList[i].name,
      name_en: restaurantList[i].name_en,
      category: restaurantList[i].category,
      rating: restaurantList[i].rating,
      location: restaurantList[i].location,
      phone: restaurantList[i].phone,
      google_map: restaurantList[i].google_map,
      image: restaurantList[i].image,
      description: restaurantList[i].description
    })
  }
  console.log('done!')
})