$(window).scroll(function() {
  $(".slideanim").each(function(){
    var pos = $(this).offset().top;

    var winTop = $(window).scrollTop();
    if (pos < winTop + 700) {
      $(this).addClass("slide");
    }
  });
});

var left = $(".lefttoright").offset().left;
$(".lefttoright").css({left:left}).animate({"left":"0px"}, "slow");
