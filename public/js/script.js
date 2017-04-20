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

  $('.panel-heading').click(function (e) {
    e.stopPropagation()
    jQuery(this).parent().children('.panel-body').toggle()
})

  // Sheetsu attempt
  // $.get('https://sheetsu.com/apis/v1.0/22d5da24f31b', function(data) {
  //   console.log(data)
  // })

})
