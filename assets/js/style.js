
// HM010

//  mouseenter  mouseleave

$('.gnb').on('mouseenter', function(){
    $('.header').addClass('-open-depth2')
}).on('mouseleave', function(){
    $('.header').removeClass('-open-depth2')
})


var swiper = new Swiper(".suggestion-place .overflow-area", {
    slideClass: "place",
    observer:true,
    observerParents:true,
    autoplay:{
        delay: 3000
    },
    loopedSlides: 10,
    speed:500,
    wahchOverflow:true,
    effect: "coverflow",
    loop: true,
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
    },
});