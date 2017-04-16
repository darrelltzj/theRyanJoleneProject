# theRyanJoleneProject
http://jsfiddle.net/loktar/rxGmk/

https://kilianvalkhof.com/2010/javascript/how-to-build-a-fast-simple-list-filter-with-jquery/

http://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript

Drafts
$('#signup').on('click', function () {
  var dimmer = $("<div></div>").width(window.innerWidth + 'px').height(window.innerHeight + 'px').addClass('dimmer')
  var signupYAdj = - $('#form-signup').height() / 2
  var signupXAdj = - $('#form-signup').width() / 2

  dimmer.on('click', function () {
    $(this).remove()
    $('#form-signup').css({visibility: 'hidden'})
  })

  $('#signup-submit').on('click', function () {
    dimmer.remove()
    $('#form-signup').css({visibility: 'hidden'})
  })

  $('body').append(dimmer)

  $('#form-signup').css({
    visibility: 'visible',
    'align-self': 'center',
    'left': '50%',
    'top': '50%',
  }).css('margin-left',signupXAdj).css('margin-top',signupYAdj)
  return false
})

if (req.body.formType === 'signup') {
  User.create({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password
  }, function (err, createdUser) {
    if (err) {
      console.error(err)
      res.redirect('/')
    }
    else {
      passport.authenticate('local', {
        successRedirect: '/rsvp'
      })(req, res)
    }
  })
}
