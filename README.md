# theRyanJoleneProject
[**theRyanJoleneProject**](https://ryanjolene.herokuapp.com) is a wedding guest registration web application for my friends, Ryan and Jolene. It is also my [second project assignment](https://jeremiahalex.gitbooks.io/wdi-sg/content/11-projects/project-2/readme.html) at General Assembly's Web Development Immersive (WDI) Course.

## User story
As the hosts of the wedding event, my friends would like to track their guests' RSVPs so that they can make informed arrangements for their wedding ceremony.

### The problem
Most couples use a survey form which usually results in the situation below:

![The Problem](http://i.imgur.com/ZTOZnm0.jpg)

There is also the hassle to print guests list to check guests off at the ceremony.

### Targeted features
To tackle the problem, the application should have the following features:

* Indication of which guests have replied, are coming and have checked in.

* Indication on which tables can still be filled.

* Information of guests' latest preferences.

* Ability to overwrite guests' preferences if necessary.

* As this is a private event. Signup should be limited to those on the guest list.

### Using the Application

#### Host

![Host Flow](http://i.imgur.com/SGKuNgb.jpg)

#### Guests

![Guest Flow](http://i.imgur.com/m4z01CO.jpg)

GIF

Wireframes

[Try it out](https://ryanjolene.herokuapp.com)

## Developing the Application

### Built With

* "async": "^2.3.0"

* "bcrypt": "^1.0.2"

* "body-parser": "^1.17.1"

* "connect-flash": "^0.1.1"

* "connect-mongo": "^1.3.2"

* "dotenv": "^4.0.0"

* "ejs": "^2.5.6"

* "express": "^4.15.2"

* "express-ejs-layouts": "^2.3.0"

* "express-session": "^1.15.2"

* "flash": "^1.1.0"

* "method-override": "^2.3.8"

* "mongoose": "^4.9.4"

* "nodemon": "^1.11.0"

* "passport": "^0.3.2"

* "passport-local": "^1.0.0"

* "path": "^0.12.7"

* "sheetsu-node": "0.0.7"

* [Bootstrap](http://getbootstrap.com/)

## RESTful Routes

### Main
```
app.use('/', require('./routes/mainRouter'))
```
```
router.route('/')
.get(isLoggedIn, haveInit, mainController.getMain)

router.route('/login')
.get(isLoggedOut, mainController.getLogin)
.post(mainController.postLogin)

router.route('/changepassword')
.get(isLoggedIn, mainController.getChangePass)
.put(isLoggedIn, mainController.putChangePass)

router.route('/preference')
.get(isLoggedIn, haveInit, mainController.getPreference)
.put(isLoggedIn, haveInit, mainController.putPreference)

router.route('/logout')
.get(isLoggedIn, mainController.getLogout)
```

### Admin
```
app.use('/admin', isLoggedIn, isAdmin, require('./routes/adminRouter'))
```
```
router.route('/')
.get(adminController.getAdminManage)

router.route('/guest/add')
.get(adminController.getAdminAddGuest)
.post(adminController.postAdminAddGuest)

router.route('/guest/:id')
.get(adminController.getAdminEditGuest)
.put(adminController.editGuest)
.delete(adminController.deleteGuest)

router.route('/table/add')
.get(adminController.getAdminAddTable)
.post(adminController.postAdminAddTable)

router.route('/table/:id')
.get(adminController.getAdminEditTable)
.put(adminController.editTable)
.delete(adminController.deleteTable)

router.route('/checkin')
.get(adminController.getAdminCheckIn)

router.route('/checkin/:id')
.get(adminController.getAdminCheckInGuest)
.put(adminController.putAdminCheckInGuest)
```

## Entity Relationship Diagram (ERD)

![ERM](http://i.imgur.com/DP3xEAZ.jpg)

### User Schema
```
var UserSchema = new mongoose.Schema({
  name:  {
    type: String,
    required: true,
    minlength: [1, 'Name must be between 1 and 99 characters'],
    maxlength: [99, 'Name must be between 1 and 99 characters'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: emailRegex
  },
  password: {
    type: String,
    required: true ,
    minlength: [6, 'Password must be between 6 and 99 characters'],
    maxlength: [99, 'Password must be between 8 and 99 characters'],
  },
  admin: {
    type: Boolean,
    default: false
  },
  attending: {
    type: Boolean,
    default: false
  },
  table: {
    type: mongoose.Schema.ObjectId,
    ref: 'Table'
  },
  foodPref: {
    type: String,
    default: 'any'
  },
  headCountAllowed: {
    type: Number,
    default: 2,
    min: [1, 'Head Count Allowed must be at least 1']
  },
  headCountSelected: {
    type: Number,
    default: 1,
    min: [0, 'Head Count Selected must be at least 0'],
    max: [this.headCountAllowed, 'Head Count Selected cannot be more than Head Count Allowed']
  },
  checkedin: {
    type: Number,
    default: 0,
    min: [0, 'Number Checked in must be at least 0'],
    max: [this.headCountSelected, 'Head Count Selected cannot be more than Head Count Selected']
  },
  haveInit: {
    type: Boolean,
    default: false
  },
  permanent: {
    type: Boolean,
    default: false
  }
})
```
**Notes**

**headCountAllowed**: Quantity of guest(s) allocated to this user

**headCountSelected**: Quantity of guest(s) this user has selected

**checkedin**: Quantity of guest(s) this user has checked in

**haveInit**: true if user has set preferences for the first time

**permanent**: true if this is the default user / owner


### Table Schema

```
var TableSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  capacity: {
    type: Number,
    default: 10,
    min: [1, 'Table capacity must be at least 1']
  },
  plannedFor: {
    type: Number,
    default: 0
  },
  reservedFor: {
    type: Number,
    default: 0
  },
  checkedIn: {
    type: Number,
    default: 0
  },
  permanent: {
    type: Boolean,
    default: false
  }
})
```
**Notes**

**plannedFor**: Quantity of guest(s) allocated to this table

**reservedFor**: Quantity of guest(s) this user has selected

**checkedIn**: Quantity of guest(s) this user has checked in

**permanent**: true if this is the default user / owner


### Create, Read, Update & Delete (CRUD) Process

Async Series

#### Adding Tables

#### Edit Table

#### Add Guest

#### Edit Guest


### Other Features

#### Guest Log In Process

#### Search Filter


## Future Development
The Work on [theRyanJoleneProject](https://ryanjolene.herokuapp.com) is not complete yet.

### Areas to improve on
[Sheetsu](https://sheetsu.com)
[Work In Progress](https://docs.google.com/spreadsheets/d/1LzxY4hgAX3bS5FdHbrJUuXiDEHazgNolckqX6ZVmPRI/edit#gid=0)
[Example](https://docs.google.com/spreadsheets/d/1LzxY4hgAX3bS5FdHbrJUuXiDEHazgNolckqX6ZVmPRI/edit#gid=0)

Event Schema
Changeable location, time, date

Email
Automate Invite
Reset Password

Facebook Login


Instragram API
Socket IO for well wishes

### Bugs
Limit Food preferences

## Author(s)

- [Darrell Teo](https://github.com/darrelltzj)

## References

https://www.beourguest.co/
http://jsfiddle.net/loktar/rxGmk/
https://kilianvalkhof.com/2010/javascript/how-to-build-a-fast-simple-list-filter-with-jquery/
http://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
https://pixabay.com/p-2162950/?no_redirect
http://stackoverflow.com/questions/22246626/show-hide-children-on-parent-click

## Credits
