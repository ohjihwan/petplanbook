
function gnbMouseenter(){
    $('.gnb').on('mouseenter', function(){
        $('.header').addClass('-open-depth2')
    }).on('mouseleave', function(){
        $('.header').removeClass('-open-depth2')
    })
}

function ratingChecked(){
    $('.rating input').on('click', function(){
        if( $(this).is(':checked') == true ) {
            $(this).closest('.rating').siblings('.rating').find('input').prop('checked', false)
        }
    });
}

function mainSuggestionSwiper(){
    let mainSuggestionSwiper = new Swiper(".suggestion-place .overflow-area", {
        slideClass: "place",
        observer:true,
        observerParents:true,
        loop: true,
        autoplay:{
            delay: 4000
        },
        loopedSlides: 10,
        speed:500,
        wahchOverflow:true,
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        coverflowEffect: {
            rotate: 15,
            stretch: 0,
            depth: 100,
            modifier: 2,
            slideShadows: true,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });

    $('.suggestion-place .overflow-area').on('mouseenter', function () {
        mainSuggestionSwiper.autoplay.stop();
    }).on('mouseleave', function () {
        mainSuggestionSwiper.autoplay.start();
    });
}

function detailImgs(){
    let detailImgs = new Swiper(".detail-imgs", {
        effect: "cards",
        observer:true,
        observerParents:true,
        grabCursor: true,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });
}

function locationModalOpen(){
    $('body').addClass('lock')
    $('.modal').show()
    detailImgs()
}

function modalOpenId(modalId){
    $('body').addClass('lock')
    $('#'+modalId).show()
    console.log(modalId)
}

function modalClose(){
    $('body').removeClass('lock')
    $('.modal').hide()
}

function followingPath(){
    const followingPath = $('.following-path')
    let swiper = new Swiper(".following-path", {
        direction: "vertical",
        slidesPerView: "auto",
        freeMode: true,
        scrollbar: {
            el: ".swiper-scrollbar",
        },
        mousewheel: true,
        resistanceRatio: 0,
        on: {
            reachBeginning: function () {
                followingPath.addClass('-start').removeClass('-end');
            },
            reachEnd: function () {
                followingPath.addClass('-end').removeClass('-start');
            }
        }
    });
    if ( followingPath.height() <= followingPath.find('ul').height() ) {
        followingPath.addClass('-start')
    }
    if ( followingPath.height() > followingPath.find('ul').height() ) {
        followingPath.addClass('-start')
        followingPath.addClass('-end')
    }
}


gnbMouseenter() // GNB
ratingChecked() // 좋아요&싫어요
mainSuggestionSwiper() // 메인 모션 스와이프
followingPath() // 동선스크롤 이벤트