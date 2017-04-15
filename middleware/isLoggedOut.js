module.exports = function (req, res, next) {
  if (req.user) {
    req.flash('error', 'You are already Logged in')
    res.redirect('/')
  } else {
    next()
  }
}
