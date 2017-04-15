$(document).ready(function () {
  $('.addGuest').change(function () {
    $("#inputAddGuest").empty()
    for (var i = 0; i < this.value; i++) {
      var j = i + 1
      $('#inputAddGuest').append('<input id="addGuestName' + j + '" class="form-control" type="text" name="addGuestName' + j + '" placeholder="Guest Name ' + j + '"><br>')
    }
  })
})
