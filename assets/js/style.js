
function gnbMouseenter(){
    $(document).on('mouseenter','.header', function(){
        $('.header').addClass('-open-depth2')
    }).on('mouseleave','.header', function(){
        $('.header').removeClass('-open-depth2')
    })
}

function ratingChecked(){
    $(document).on('click','.rating input', function(){
        if( $(this).is(':checked') == true ) {
            $(this).closest('.rating').siblings('.rating').find('input').prop('checked', false)
        }
    });
}


function detailImgs(){
    let detailImgs = new Swiper(".detail-imgs", {
        grabCursor: true,
		effect: "creative",
		creativeEffect: {
			prev: {
				shadow: true,
				translate: [0, 0, -400],
			},
			next: {
				translate: ["100%", 0, 0],
			},
		},
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });
}

function modalOpenId(modalId){
    $('body').addClass('lock')
    $(`#${modalId}`).show()
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

function makeRoute(){
    $('.make-route').sortable({
    handle: '.sorting-handler',
    axis: 'y',
    containment: 'parent',
    start: function (e, ui) {
        ui.item.css('transform', 'scale(1.05)'); // 드래그 시작 시 투명도
    },
    stop: function (e, ui) {
        ui.item.css('transform', 'scale(1)'); // 드래그 끝나면 복원
    }
    });
};

const guideArrow = document.querySelector('.guide-arrow');
if (guideArrow) {
	guideArrow.addEventListener('click', function () {
		const header = document.querySelector('.header');
		const banner = document.querySelector('.main-banner');

		const headerHeight = header ? header.offsetHeight : 0;
		const bannerHeight = banner ? banner.offsetHeight : 0;
		const scrollY = headerHeight + bannerHeight;

		window.scrollTo({
			top: scrollY,
			behavior: 'smooth'
		});
	});
}

$(document).on('keydown', function (e) {
	if (e.key === "Escape" || e.keyCode === 27) {
		modalClose() // 해당 팝업 닫힘
	}
});

gnbMouseenter() // GNB
ratingChecked() // 좋아요&싫어요
followingPath() // 동선스크롤 이벤트
makeRoute() // 루트꾸미기 순서 섞기
// profileEditMode() // 프로필 수정하기