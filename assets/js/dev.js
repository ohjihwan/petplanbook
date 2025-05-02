
/******************************
 * 맵 AIP
******************************/
let map;
	
window.onload = function () {
  // SDK 수동 로드
  kakao.maps.load(function () {
	// 지도 생성
	map = new kakao.maps.Map(document.getElementById("map"), {
	  center: new kakao.maps.LatLng(33.2539, 126.5596), // 서귀포시 중심
	  level: 9
	});

	// 초기 데이터 로딩 (원한다면 여기에 정의)
	if (typeof loadData === "function") {
	  loadData();
	}
  });
};