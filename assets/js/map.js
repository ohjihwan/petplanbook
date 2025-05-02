
/******************************
 * 맵 AIP
******************************/

function mapSeting() {
	// 전역 변수 선언
	let markers = [];
	let map;
	let places;
	let infowindow;
	let swiper;

	// 카카오맵 SDK 동적 로드
	function loadKakaoMap() {
	return new Promise((resolve, reject) => {
		const script = document.createElement("script");
		script.type = "text/javascript";
		script.src =
		"//dapi.kakao.com/v2/maps/sdk.js?appkey=9921046766278baaca9a7d657feaf033&libraries=services&autoload=false";
		script.onload = () => {
		kakao.maps.load(() => {
			resolve();
		});
		};
		script.onerror = reject;
		document.head.appendChild(script);
	});
	}

	// 지도 초기화
	function initMap() {
	const container = document.getElementById("map");
	const options = {
		center: new kakao.maps.LatLng(37.5665, 126.978), // 서울 중심
		level: 7,
	};
	map = new kakao.maps.Map(container, options);
	places = new kakao.maps.services.Places();
	infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
	}

	// 마커 생성
	function createMarker(position, title, address) {
	const marker = new kakao.maps.Marker({
		map: map,
		position: position,
		title: title,
	});

	kakao.maps.event.addListener(marker, "click", function () {
		displayInfowindow(marker, title, address);
		showLocationDetail(title, address);
	});

	return marker;
	}

	// 마커 제거
	function removeMarkers() {
	for (let i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
	markers = [];
	}

	// 장소 검색
	function searchPlaces() {
	const keyword = document.getElementById("keyword").value;
	if (!keyword) {
		alert("키워드를 입력해주세요!");
		return false;
	}

	removeMarkers();

	places.keywordSearch(keyword, placesSearchCB, {
		location: map.getCenter(),
		radius: 50000,
		sort: kakao.maps.services.SortBy.DISTANCE,
	});
	}

	// 검색 결과 처리
	function placesSearchCB(data, status, pagination) {
	if (status === kakao.maps.services.Status.OK) {
		displayPlaces(data);
		displayPagination(pagination);
	} else if (status === kakao.maps.services.Status.ZERO_RESULT) {
		alert("검색 결과가 존재하지 않습니다.");
		return;
	} else if (status === kakao.maps.services.Status.ERROR) {
		alert("검색 결과 중 오류가 발생했습니다.");
		return;
	}
	}

	// 검색 결과 표시
	function displayPlaces(places) {
	const listEl = document.getElementById("placesList");
	const menuEl = document.getElementById("menu_wrap");
	const fragment = document.createDocumentFragment();

	removeMarkers();

	for (let i = 0; i < places.length; i++) {
		const placePosition = new kakao.maps.LatLng(places[i].y, places[i].x);
		const marker = createMarker(
		placePosition,
		places[i].place_name,
		places[i].address_name
		);
		markers.push(marker);

		const itemEl = getListItem(i, places[i]);
		fragment.appendChild(itemEl);
	}

	listEl.innerHTML = "";
	listEl.appendChild(fragment);
	menuEl.scrollTop = 0;
	}

	// 검색 결과 항목 생성
	function getListItem(index, places) {
	const el = document.createElement("li");
	let itemStr =
		'<span class="markerbg marker_' +
		(index + 1) +
		'"></span>' +
		'<div class="info">' +
		"   <h5>" +
		places.place_name +
		"</h5>";

	if (places.road_address_name) {
		itemStr +=
		"    <span>" +
		places.road_address_name +
		"</span>" +
		'   <span class="jibun gray">' +
		places.address_name +
		"</span>";
	} else {
		itemStr += "    <span>" + places.address_name + "</span>";
	}

	if (places.phone) {
		itemStr += '  <span class="tel">' + places.phone + "</span>";
	}

	itemStr += "</div>";

	el.innerHTML = itemStr;
	el.className = "item";

	el.onclick = function () {
		const position = new kakao.maps.LatLng(places.y, places.x);
		map.setCenter(position);
		map.setLevel(3);
		displayInfowindow(markers[index], places.place_name, places.address_name);
		showLocationDetail(places.place_name, places.address_name);
	};

	return el;
	}

	// 정보창 표시
	function displayInfowindow(marker, title, address) {
	const content =
		'<div style="padding:5px;z-index:1;">' +
		title +
		"<br>" +
		address +
		"</div>";
	infowindow.setContent(content);
	infowindow.open(map, marker);
	}

	// 페이지네이션 표시
	function displayPagination(pagination) {
	const paginationEl = document.getElementById("pagination");
	const fragment = document.createDocumentFragment();
	let i;

	while (paginationEl.hasChildNodes()) {
		paginationEl.removeChild(paginationEl.lastChild);
	}

	for (i = 1; i <= pagination.last; i++) {
		const el = document.createElement("a");
		el.href = "#";
		el.innerHTML = i;

		if (i === pagination.current) {
		el.className = "on";
		} else {
		el.onclick = (function (i) {
			return function () {
			pagination.gotoPage(i);
			};
		})(i);
		}

		fragment.appendChild(el);
	}
	paginationEl.appendChild(fragment);
	}

	// 지역 선택 이벤트 처리
	function setupRegionSelect() {
	const regionSelect = document.getElementById("region");
	const regionCoords = {
		서울특별시: new kakao.maps.LatLng(37.5665, 126.978),
		제주특별자치도: new kakao.maps.LatLng(33.2539, 126.5596),
		부산광역시: new kakao.maps.LatLng(35.1796, 129.0756),
		대구광역시: new kakao.maps.LatLng(35.8714, 128.6014),
		인천광역시: new kakao.maps.LatLng(37.4563, 126.7052),
		광주광역시: new kakao.maps.LatLng(35.1595, 126.8526),
		대전광역시: new kakao.maps.LatLng(36.3504, 127.3845),
		울산광역시: new kakao.maps.LatLng(35.5384, 129.3114),
		세종특별자치시: new kakao.maps.LatLng(36.48, 127.2891),
		경기도: new kakao.maps.LatLng(37.4138, 127.5183),
		강원특별자치도: new kakao.maps.LatLng(37.8228, 128.1555),
		충청북도: new kakao.maps.LatLng(36.6372, 127.489),
		충청남도: new kakao.maps.LatLng(36.5184, 126.8),
		전라북도: new kakao.maps.LatLng(35.7175, 127.153),
		전라남도: new kakao.maps.LatLng(34.8679, 126.991),
		경상북도: new kakao.maps.LatLng(36.4919, 128.8889),
		경상남도: new kakao.maps.LatLng(35.4606, 128.2132),
	};

	regionSelect.addEventListener("change", function () {
		const selectedRegion = this.value;
		if (selectedRegion && regionCoords[selectedRegion]) {
		map.setCenter(regionCoords[selectedRegion]);
		map.setLevel(7);
		}
	});
	}

	// 검색 버튼 이벤트 처리
	function setupSearchButton() {
	document
		.querySelector(".comp-buttons button")
		.addEventListener("click", function () {
		searchPlaces();
		});
	}

	// 장소 상세 정보 표시
	function showLocationDetail(title, address) {
	const modal = document.querySelector(".modal");
	const details = modal.querySelector(".details");

	details.querySelector("dd:nth-child(2)").textContent = title;
	details.querySelector("dd:nth-child(4)").textContent = address;

	modal.style.display = "block";
	}

	// 모달 닫기
	function modalClose() {
	document.querySelector(".modal").style.display = "none";
	}

	// Swiper 초기화
	function initSwiper() {
	swiper = new Swiper(".mySwiper", {
		navigation: {
		nextEl: ".swiper-button-next",
		prevEl: ".swiper-button-prev",
		},
	});
	}

	// 초기화 함수
	async function initialize() {
	try {
		await loadKakaoMap();
		initMap();
		setupRegionSelect();
		setupSearchButton();
		initSwiper();

		// 모달 닫기 버튼 이벤트
		document
		.querySelector(".modal .close")
		.addEventListener("click", modalClose);
	} catch (error) {
		console.error("Error initializing map:", error);
	}
	}

	// DOM 로드 완료 후 초기화
	document.addEventListener("DOMContentLoaded", initialize);
}

// mapSeting() // 맵 초기 세팅