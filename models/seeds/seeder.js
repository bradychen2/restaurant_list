if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const db = require('../../config/mongoose')
const bcrypt = require('bcryptjs')
const Restaurant = require('../restaurant')
const User = require('../user')
const restaurantCollection = require('./restaurant.json')
const restaurantList = restaurantCollection.results

const users = [
  {
    name: 'test',
    email: 'test@test.com',
    password: '123456789'
  },
  {
    name: 'example',
    email: 'example@example.com',
    password: '123456789'
  }
]

const createUser = (attributes, hash) => {
  return new Promise((resolve, reject) => {
    attributes.password = hash
    User
      .create(attributes)
      .then(user => resolve(user))
      .catch(err => reject(err))
  })
}

const createRest = (attributes, userId) => {
  return new Promise((resolve, reject) => {
    attributes.userId = userId
    Restaurant
      .create(attributes)
      .then(() => resolve())
      .catch(err => reject(err))
  })
}

db.once('open', async () => {
  for (let i = 0; i < 2; i++) {
    try {
      salt = await bcrypt.genSalt(10)
      hash = await bcrypt.hash(users[i].password, salt)

      const { name, email } = users[i]
      user = await createUser({ name, email }, hash)
      userId = user._id

      for (let j = i * 3; j < (i + 1) * 3; j++) {
        const { name, name_en, category, rating,
          location, phone, google_map, image, description } = restaurantList[j]

        await createRest({
          name, name_en, category, rating,
          location, phone, google_map, image, description
        }, userId)
      }
    } catch (err) {
      console.log(err)
    }
  }
  console.log('done!')
  process.exit()
})