module.exports = function (req, res, next) {
  if (!req.user.admin) {
    req.flash('error', 'You must an Admin to access this page')
    res.redirect('/')
  } else {
    next()
  }
}
