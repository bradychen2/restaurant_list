const express = require('express')
const User = require('../../models/user')
const router = express.Router()
const passport = require('passport')
const bcrpyt = require('bcryptjs')

router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
}))

router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

module.exports = router