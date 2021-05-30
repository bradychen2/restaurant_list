const restaurantController = require('../controllers/restaurantController')
const userController = require('../controllers/userController')

module.exports = (app, passport) => {
  function authenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    req.flash('warning_msg', '請先登入才能使用！')
    res.redirect('/users/login')
  }

  // --------------------------Restaurant--------------------------
  app.get('/', authenticated, restaurantController.getRestaurants)
  // Search
  app.get('/restaurants/search', authenticated, restaurantController.searchRestaurant)
  // Create
  app.get('/restaurants/new', authenticated, restaurantController.getCreateRestaurant)
  app.post('/restaurants', authenticated, restaurantController.postRestaurant)
  // Edit
  app.get('/restaurants/:id/edit', authenticated, restaurantController.getEditRestaurant)
  app.put('/restaurants/:id', authenticated, restaurantController.putRestaurant)
  // Display One
  app.get('/restaurants/:id', authenticated, restaurantController.getRestaurant)
  // Delete
  app.delete('/restaurants/:id', authenticated, restaurantController.deleteRestaurant)

  // -----------------------------User-----------------------------
  // Local Strategy
  app.get('/users/login', userController.signInPage)
  app.post('/users/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login'
  }))

  // Facebook Login
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email', 'public_profile']
  }))
  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/users/login'
  }))

  app.get('/users/register', userController.signUpPage)
  app.post('/users/register', userController.signUp)
  app.get('/users/logout', userController.logout)
}