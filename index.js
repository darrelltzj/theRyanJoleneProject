const express = require('express')
const app = express()
const path = require('path')
const ejsLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('./config/passport')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const isLoggedIn = require('./middleware/isLoggedIn')
const isAdmin = require('./middleware/isAdmin')
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

app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.urlencoded({ extended: false }))

app.use(flash())

app.use(ejsLayouts)
app.use(require('./middleware/setCurrentUser'))
app.set('view engine', 'ejs')

app.use('/', require('./routes/mainRouter'))
// could not link to script.js and style.css when /admin/checkin was used
app.use('/adminmanage', isLoggedIn, isAdmin, require('./routes/adminManageRouter'))
app.use('/admincheckin', isLoggedIn, isAdmin, require('./routes/adminCheckInRouter'))

app.listen(process.env.PORT)
