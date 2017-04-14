const express = require('express')
const app = express()
const path = require('path')
const ejsLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('./config/passport')
const MongoStore = require('connect-mongo')(session)
// const isLoggedIn = require('./middleware/isLoggedIn')
require('dotenv').config({ silent: true })

var dbURI = process.env.PROD_MONGODB || 'mongodb://localhost/theryanjoleneproject'
mongoose.connect(dbURI)
mongoose.Promise = global.Promise

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ url: process.env.PROD_MONGODB })
}))
app.use(passport.initialize())
app.use(passport.session())

app.set('view engine', 'ejs')
app.use(ejsLayouts)
app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', require('./routes/mainRouter'))
// app.use('/', require('./routes/user_router'))

app.listen(process.env.PORT)
