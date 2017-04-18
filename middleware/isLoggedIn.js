module.exports = function (req, res, next) {
  if (!req.user) {
    req.flash('error', 'This is a private event. You must be logged in to access the page')
    res.redirect('/login')
  } else {
    next()
  }
}
