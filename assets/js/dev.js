
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
}

// deleteData() // 뭔가 삭제할때 쓰는 스크립트
// deleteDataPage() // 게시글 자체가 페이지 내 삭제될 경우

/* 로드 페이지 관리 */
$('.page .header').load('../../html/ETC/header.html');
$('.page .footer').load('../../html/ETC/footer.html');
$('.modal.-login-modal').load('../../html/ETC/login.html');
