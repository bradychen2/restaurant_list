// import modules and files
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
require('./config/mongoose')
const routes = require('./routes')

// set required constant for server
const app = express()
const port = 3000

// set template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// set static files
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({
  secret: 'SuperSecret',
  resave: false,
  saveUninitialized: true
}))

app.use(routes)

// server listening
app.listen(port, () => {
  console.log(`Express server is listening on http://localhost:${port}`)
})