$(document).ready(function () {

  jQuery.expr[':'].Contains = function(a,i,m){
    return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase())>=0
  }

  function listFilter (searchBar, list) {
    $(searchBar).change( function () {
      var filter = $(this).val()
      if (filter) {
        $(list).find("a:not(:Contains(" + filter + "))").parent().slideUp()
        $(list).find("a:Contains(" + filter + ")").parent().slideDown()
      }
      else {
        $(list).find("li").slideDown()
      }
    }).keyup( function () {
      $(this).change()
    })
  }

  listFilter ($('#nameSearch'), $('#guestList'))

  // $('.addGuest').change(function () {
  //   $("#inputAddGuest").empty()
  //   for (var i = 0; i < this.value; i++) {
  //     var j = i + 1
  //     $('#inputAddGuest').append('<input id="addGuestName' + j + '" class="form-control" type="text" name="addGuestName' + j + '" placeholder="Guest Name ' + j + '"><br>')
  //   }
  // })
})
