const express = require('express')
const User = require('../../models/user')
const router = express.Router()
const passport = require('passport')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: '所有欄位都為必填！' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不符！' })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email
    })
  }
  User.findOne({ email })
    .then(user => {
      if (user) {
        errors.push({ message: '此 Email 已經註冊。' })
        res.render('register', {
          errors,
          name,
          email
        })
      } else {
        return User.create({
          name,
          email,
          password
        })
          .then(() => {
            res.redirect('/users/login')
          })
          .catch(err => {
            console.log(err)
          })
      }
    })
})

router.get('/logout', (req, res) => {
  req.logout() // Passport logout func
  req.flash('success_msg', '你已經成功登出！')
  res.redirect('/users/login')
})

module.exports = router