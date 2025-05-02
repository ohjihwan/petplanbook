
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
// mapSeting() // 맵 초기 세팅