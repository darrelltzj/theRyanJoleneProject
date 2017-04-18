module.exports = function (req, res, next) {
  if (!req.user.haveInit) {
    req.flash('error', 'Please change your password before proceeding.')
    res.redirect('/changepassword')
  } else {
    next()
  }
}
