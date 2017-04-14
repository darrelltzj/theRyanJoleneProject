$(document).ready(function () {
  $('#signup').on('click', function () {
    var dimmer = $("<div></div>").width(window.innerWidth + 'px').height(window.innerHeight + 'px').addClass('dimmer')
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
      'margin-left': '-15vw',
      'top': '50%',
      'margin-top': '-35vh'
    })
    return false
  })

    // $('#login').on('click', function () {
    //   console.log('login')
    // })
    // $('#signup').on('click', function () {
    //   // console.log('signup')
    //   swal.withForm({
    //     title: 'Signup',
    //     showCancelButton: false,
    //     confirmButtonColor: '#DD6B55',
    //     confirmButtonText: 'Signup',
    //     closeOnConfirm: true,
    //     formFields: [
    //       { id: 'name', placeholder: 'Name' },
    //       { id: 'email', placeholder: 'Email' },
    //       { id: 'password', placeholder: 'Password' },
    //       { id: 'confirm-password', placeholder: 'Confirm Password' }
    //     ]
    //   }, function (isConfirm) {
    //     console.log(this.swalForm)
    //     $.ajax({
    //       url: '/',
    //       type: 'POST',
    //       data: {
    //         type: 'signup',
    //         name: this.swalForm.name,
    //         email: this.swalForm.email,
    //         password: this.swalForm.password,
    //       }
    //     }).done(function (data) {
    //       console.log('success')
    //     }).fail(function () {
    //       console.log('error')
    //     })
    //   })
    // })
})
