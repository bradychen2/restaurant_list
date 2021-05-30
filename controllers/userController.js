const passport = require('passport')
const bcrpyt = require('bcryptjs')
const User = require('../models/user')

const userController = {
  signInPage: (req, res) => {
    res.render('login')
  },

  signUpPage: (req, res) => {
    res.render('register')
  },

  signUp: async (req, res) => {
    const { name, email, password, confirmPassword } = req.body
    const errors = []
    // blank input
    if (!email || !password || !confirmPassword) {
      errors.push({ message: 'Email和密碼欄位為必填！' })
    }
    // confirm password wrong
    if (password !== confirmPassword) {
      errors.push({ message: '密碼與確認密碼不符！' })
    }
    if (errors.length) {
      return res.render('register', { errors, name, email })
    } else {
      const user = await User.findOne({ email })
      // email already exists
      if (user) {
        errors.push({ message: '此 Email 已經註冊。' })
        return res.render('register', { errors, name, email })
      }
      // create new user
      const salt = await bcrpyt.genSalt(10)
      const hash = await bcrpyt.hash(password, salt)
      await User.create({ name, email, password: hash })

      return res.redirect('/users/login')
    }
  },

  logout: (req, res) => {
    req.logout() // Passport logout func
    req.flash('success_msg', '你已經成功登出！')
    res.redirect('/users/login')
  }
}

module.exports = userController