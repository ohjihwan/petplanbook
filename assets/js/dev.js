
/******************************
 * 맵 AIP
******************************/

function mapSeting() {
	let map;
	window.onload = function () {
		kakao.maps.load(function () {
			map = new kakao.maps.Map(document.getElementById("map"), {
				center: new kakao.maps.LatLng(33.2539, 126.5596), // 서귀포시 중심
				level: 9
			});
			if (typeof loadData === "function") {
				loadData();
			}
		});
	};
}

function deleteData() {
	Swal.fire({
		title: "정말 삭제할까요?",
		text: "이 작업은 되돌릴 수 없습니다.",
		icon: "warning",
		showCancelButton: true,
		// confirmButtonColor: "#ffcd00",
		// cancelButtonColor: "#dcdcdc", 
		confirmButtonText: "삭제하기",
		cancelButtonText: "취소",
	}).then((result) => {
		if (result.isConfirmed) {
			// 🔥 실제 삭제 처리 실행
			console.log("삭제됨!");
			// 여기에 삭제 API 호출 or DOM 조작 등 추가
		} else {
			console.log("삭제 취소됨");
		}
	});
}



// deleteData() // 뭔가 삭제할때 쓰는 스크립트
// mapSeting() // 맵 초기 세팅