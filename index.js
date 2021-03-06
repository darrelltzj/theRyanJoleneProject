const express = require('express')
const app = express()
const path = require('path')
const ejsLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('./config/passport')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const isLoggedIn = require('./middleware/isLoggedIn')
const isAdmin = require('./middleware/isAdmin')
require('dotenv').config({ silent: true })

mongoose.connect(process.env.PROD_MONGODB)
mongoose.Promise = global.Promise

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ url: process.env.PROD_MONGODB })
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(path.join(__dirname, 'public')))

app.use(methodOverride('_method'))

app.use(bodyParser.urlencoded({ extended: false }))

app.use(flash())

app.use(ejsLayouts)
app.use(require('./middleware/setCurrentUser'))
app.set('view engine', 'ejs')

app.use('/', require('./routes/mainRouter'))
app.use('/admin', isLoggedIn, isAdmin, require('./routes/adminRouter'))
app.use('/admin', isLoggedIn, isAdmin, require('./routes/sheetsuRouter'))

app.listen(process.env.PORT)
