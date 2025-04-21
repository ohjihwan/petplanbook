
// HM010

//  mouseenter  mouseleave

$('.gnb').on('mouseenter', function(){
    $('.header').addClass('-open-depth2')
}).on('mouseleave', function(){
    $('.header').removeClass('-open-depth2')
})