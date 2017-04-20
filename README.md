# theRyanJoleneProject
[**theRyanJoleneProject**](https://ryanjolene.herokuapp.com) is a wedding guest registration web application for my friends, Ryan and Jolene. It is also my [second project assignment](https://jeremiahalex.gitbooks.io/wdi-sg/content/11-projects/project-2/readme.html) at General Assembly's Web Development Immersive (WDI) Course.

## User story

Role: Event Host

Goal: Simplify guest registration for wedding, entertain guests

Motivation: Less hassle, want guests to have a good time at wedding. Reduce paper (paperless check in)

### Problem

#### Host

![Host Before](http://i.imgur.com/HuUq8yR.jpg)

#### Guest

![Guest Before](http://i.imgur.com/HBX9SZA.jpg)


## Features

GIF

*Know which tables can be filled.

*Know which guests have replied, are coming and have checked in.

*Set guests' preferences if necessary.

*Be informed of your guests' latest preferences.

*Save paper #saveTheEnvironment

### User Flow Process

#### Host

![Host Flow](http://i.imgur.com/SGKuNgb.jpg)

#### Guests

![Guest Flow](http://i.imgur.com/7vHZN7q.jpg)

### Search Filter


## Development Process


## Entity Relationship Diagram (ERD)

![ERM](http://i.imgur.com/DP3xEAZ.jpg)

## Wireframes

drawing

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

### Processes
Add Table

Edit Table

Add Guest

Edit Guest

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

## Areas to improve on
[Sheetsu](https://sheetsu.com)
[Work In Progress](https://docs.google.com/spreadsheets/d/1LzxY4hgAX3bS5FdHbrJUuXiDEHazgNolckqX6ZVmPRI/edit#gid=0)
[Example](https://docs.google.com/spreadsheets/d/1LzxY4hgAX3bS5FdHbrJUuXiDEHazgNolckqX6ZVmPRI/edit#gid=0)

Email
Reset Password

Facebook Login
Instragram API

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
