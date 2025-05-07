
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

    $(document).on('mouseenter','.suggestion-place .overflow-area', function () {
        mainSuggestionSwiper.autoplay.stop();
    }).on('mouseleave','.suggestion-place .overflow-area', function () {
        mainSuggestionSwiper.autoplay.start();
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

function locationModalOpen(){
    $('body').addClass('lock')
    $('.modal').show()
    // detailImgs()
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

function profileEditMode(e) {
	const $editModeHasDiv = $('.profile-area');
	const $target = $(e);
	if (!$editModeHasDiv.hasClass('-edit-mode')) {
		$editModeHasDiv.addClass('-edit-mode');
		$('.profile-buttons .button.none').removeClass('none');
		$target.addClass('none');
	}

	const user = JSON.parse(localStorage.getItem("user"));
	if (user) {
		$('#nickname-input').val(user.nickname);
		$('#password-change').val('');
		$('#password-change-comp').val('');
		$('#region-select').val(user.region);

		// ✅ 반려동물 체크박스 초기화 및 설정
		const petValues = (user.cat_or_dog || "")
			.split(',')
			.map(v => v.trim())
			.filter(v => v && v !== '없음');

		const $petInputs = $('.profile-my-changes input[name="pet"]'); // 🎯 특정 영역만
		$petInputs.prop('checked', false);
		$petInputs.each(function () {
			if (petValues.includes($(this).val())) {
				$(this).prop('checked', true);
			}
		});
	}

	$('.profile-my-changes').removeClass('none');
	$('.profile-my-views').addClass('none');
}

gnbMouseenter() // GNB
ratingChecked() // 좋아요&싫어요
mainSuggestionSwiper() // 메인 모션 스와이프
followingPath() // 동선스크롤 이벤트
makeRoute() // 루트꾸미기 순서 섞기
// profileEditMode() // 프로필 수정하기