
function deleteData(el, delArea) {
    const $btn = $(el);
    const $delArea = $btn.closest(delArea)
	Swal.fire({
		title: "정말 삭제할까요?",
		text: "이 작업은 되돌릴 수 없습니다.",
		icon: "warning",
		showCancelButton: true,
		confirmButtonColor: "#ffcd00",
		cancelButtonColor: "#dcdcdc", 
		confirmButtonText: "삭제하기",
		cancelButtonText: "취소",
	}).then((result) => {
		if (result.isConfirmed) {
			$delArea.remove()
			console.log( $delArea );
			console.log("삭제됨! 이거 그냥 만들어본거지 진짜 삭제인지는 모름");
			// 여기에 삭제 API 호출 or DOM 조작 등 추가
		} else {
			console.log("삭제 취소됨");
		}
	});
}

function deleteDataPage() {
    Swal.fire({
		title: "정말 삭제할까요?",
		text: "이 작업은 되돌릴 수 없습니다.",
		icon: "warning",
		showCancelButton: true,
		confirmButtonColor: "#ffcd00",
		cancelButtonColor: "#dcdcdc", 
		confirmButtonText: "삭제하기",
		cancelButtonText: "취소",
	}).then((result) => {
        Swal.fire({
            title: "삭제가 완료되었습니다.",
            icon: "success",
            confirmButtonText: "확인",
            showCancelButton: false
        });
	});
}

function loginOpenPage() {
	$('body').addClass('lock');
	$('.modal.-login-modal').show();
	$('.modal .signup-area').hide();
	$('.modal .login-area').show();
}

function loginShow() {
	$('.modal .signup-area').hide();
	$('.modal .login-area').show();
	$('.login-form .button:contains("로그인")').removeClass('none');
}

function signupShow() {
	$('.modal .login-area').hide();
	$('.modal .signup-area').show();
	$('.signup-form .field.step2').hide();
	$('.button.-secondary').addClass('none');
	$('.button.-primary').addClass('none');
	$('.button:contains("다음")').removeClass('none');
	recalculateSignupFormHeight();
}

function optionalField(e) {
	let isValid = true;
	$('.signup-form .field.step1 :input[required]').each(function () {
		const value = $(this).val()?.trim();
		if (value === '') {
			isValid = false;
			$(this).closest('.field').addClass('-error');
		} else {
			$(this).closest('.field').removeClass('-error');
		}
	});
	if (!isValid) {
		alert('모든 필수 입력값을 입력해 주세요.');
		return;
	}
	$('.signup-form .field.step1').hide();
	$('.signup-form .field.step2').show();
	$(e).addClass('none');
	$(e).siblings('.button.-secondary').removeClass('none');
	$('.button.-primary').removeClass('none');
	recalculateSignupFormHeight();
}

function goBackToRequired(e) {
	$('.signup-form .field.step2').hide();
	$('.signup-form .field.step1').show();
	$(e).addClass('none');
	$(e).siblings('.button.-secondary').removeClass('none');
	$('.button.-primary').addClass('none');
	recalculateSignupFormHeight();
}

function setImagePreviewAll(contextSelector) {
	$(contextSelector).on('change', 'input[type="file"]', function (e) {
		const file = e.target.files[0];
		const $field = $(this).closest('.field');
		const $previewImg = $field.find('.img-view-box img');

		if (file && file.type.startsWith('image/')) {
			const reader = new FileReader();
			reader.onload = function (event) {
				$previewImg.attr('src', event.target.result);

				// 🔥 이미지 로드 후 폼 높이 다시 계산
				$previewImg.on('load', function () {
					recalculateSignupFormHeight();
				});
			};
			reader.readAsDataURL(file);
		} else {
			$previewImg.attr('src', '');
			recalculateSignupFormHeight(); // 이미지 지운 경우도 높이 반영
		}
	});
}

function recalculateSignupFormHeight() {
	let totalHeight = 0;
	$('.signup-form .field:visible').each(function () {
		totalHeight += $(this).outerHeight(true);
	});
	totalHeight += $('.signup-form .buttons').outerHeight(true);
	$('.signup-form').height(totalHeight);
}

function submitSignupForm() {
	const $form = $('.signup-form');
	const signupData = {
		email: $form.find('[name="email"]').val()?.trim(),
		password: $form.find('[name="password"]').val()?.trim(),
		passwordConfirm: $form.find('[name="passwordConfirm"]').val()?.trim(),
		nickname: $form.find('[name="nickname"]').val()?.trim(),
		region: $form.find('[name="region"]').val(),
		pets: [],
		fileName: $form.find('[name="profileImage"]')[0]?.files[0]?.name || null
	};
	$form.find('input[name="pet"]:checked').each(function () {
		signupData.pets.push($(this).val() || $(this).next('label').text());
	});
	console.log('회원가입 데이터:', signupData);
	alert('회원가입이 완료되었습니다!');
	$form[0].reset();
	$form.find('.img-view-box img').attr('src', '');
	$form.find('.field').removeClass('-error');
	$form.find('.field.step2').hide();
	$form.find('.field.step1').show();
	$form.find('.button.-secondary').addClass('none');
	$form.find('.button.-primary').addClass('none');
	$form.find('.button:contains("다음")').removeClass('none');
	recalculateSignupFormHeight();
	loginShow();
}

function errorInputClear() {
	$(document).on('keyup change', ':input[required]', function () {
		const $field = $(this).closest('.field');
		const type = $(this).attr('type');
		const value = $(this).val();
		if (type === 'file') {
			if (this.files.length > 0) {
				$field.removeClass('-error');
			}
		} else {
			if (value && value.trim().length > 0) {
				$field.removeClass('-error');
			}
		}
	});
}

// deleteData() // 뭔가 삭제할때 쓰는 스크립트
// deleteDataPage() // 게시글 자체가 페이지 내 삭제될 경우
errorInputClear() // 인풋 유휴성 체크

/* 로드 페이지 관리 */
$('.page .header').load('../../html/ETC/header.html');
$('.page .footer').load('../../html/ETC/footer.html');
$('.modal.-login-modal').load('../../html/ETC/login.html');
