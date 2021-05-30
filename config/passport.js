const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FaceBookStrategy = require('passport-facebook').Strategy
const User = require('../models/user')
const bcrypt = require('bcryptjs')

passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true },
  (req, email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false, req.flash('error_msg', '此 email 未註冊!'))
        } else {
          bcrypt.compare(password, user.password).then(isMatch => {
            if (!isMatch) {
              return done(null, false, req.flash('error_msg', 'Email 或密碼不正確!'))
            }
            console.log(user)
            return done(null, user)
          })
            .catch(err => done(err, false))
        }
      })
      .catch(err => done(err, false))
  }))

passport.use(new FaceBookStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK,
  profileFields: ['email', 'displayName']
}, (accessToken, refreshToken, profile, done) => {
  const { name, email } = profile._json
  User.findOne({ email })
    .then(user => {
      if (user) return done(null, user)
      const randomPassword = Math.random().toString(36).slice(-8)
      bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(randomPassword, salt))
        .then(hash => User.create({
          name,
          email,
          password: hash
        }))
        .then(user => done(null, user))
        .catch(err => done(err, false))
    })
}))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id)
    .lean()
    .then(user => done(null, user))
    .catch(err => done(err, null))
})

module.exports = passport