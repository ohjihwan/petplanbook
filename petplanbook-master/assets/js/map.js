/******************************
 * 맵 API
 ******************************/

// 전역 변수 선언
let map;
let markers = [];
let routeMarkers = [];
let selectedPlaces = [];
let polyline;
let places;
let selectedMarker = null;
let currentInfoWindow = null;
let swiper;
let travelData = [];
let filteredData = [];
let currentPage = 1;
const itemsPerPage = 8;
let selectedPlace = null;

// 카테고리 설정
const CATEGORY_CONFIG = {
	AD5: { name: "숙소", keyword: "애견동반숙소", color: "#FF6B6B" },
	FD6: { name: "식당", keyword: "애견동반식당", color: "#4ECDC4" },
	CE7: { name: "카페", keyword: "애견동반카페", color: "#45B7D1" },
	AT4: { name: "명소", keyword: "애견동반명소", color: "#96CEB4" },
};

// 지역별 중심 좌표 정의
const REGION_COORDS = {
	서울특별시: { lat: 37.5665, lng: 126.978 },
	제주특별자치도: { lat: 33.2539, lng: 126.5596 },
	부산광역시: { lat: 35.1796, lng: 129.0756 },
	대구광역시: { lat: 35.8714, lng: 128.6014 },
	인천광역시: { lat: 37.4563, lng: 126.7052 },
	광주광역시: { lat: 35.1595, lng: 126.8526 },
	대전광역시: { lat: 36.3504, lng: 127.3845 },
	울산광역시: { lat: 35.5384, lng: 129.3114 },
	세종특별자치시: { lat: 36.48, lng: 127.2891 },
	경기도: { lat: 37.4138, lng: 127.5183 },
	강원특별자치도: { lat: 37.8228, lng: 128.1555 },
	충청북도: { lat: 36.6372, lng: 127.489 },
	충청남도: { lat: 36.5184, lng: 126.8 },
	전라북도: { lat: 35.7175, lng: 127.153 },
	전라남도: { lat: 34.8679, lng: 126.991 },
	경상북도: { lat: 36.4919, lng: 128.8889 },
	경상남도: { lat: 35.4606, lng: 128.2132 },
};

// 지도 초기화 함수
function initMap() {
	console.log("initMap 함수 실행");
	const container = document.getElementById("map");
	if (!container) {
		console.error("지도 컨테이너를 찾을 수 없습니다.");
		return;
	}

	try {
		// 지도 컨테이너 스타일 설정
		container.style.cssText = `
			display: block !important;
			visibility: visible !important;
			position: relative !important;
			width: 100% !important;
			height: 500px !important;
			min-height: 500px !important;
			z-index: 1 !important;
			background-color: #f8f8f8 !important;
		`;

		// 지도 생성 전에 SDK 로드 확인
		if (typeof kakao === "undefined" || !kakao.maps) {
			console.error("카카오맵 SDK가 로드되지 않았습니다.");
			return;
		}

		// 서울특별시 중심 좌표
		const seoulCoords = REGION_COORDS["서울특별시"];
		const options = {
			center: new kakao.maps.LatLng(seoulCoords.lat, seoulCoords.lng),
			level: 8,
			draggable: true,
			scrollwheel: true,
			disableDoubleClickZoom: false,
			keyboardShortcuts: true,
		};

		map = new kakao.maps.Map(container, options);
		console.log("지도 객체 생성 완료");

		// 지도 로드 완료 이벤트
		kakao.maps.event.addListener(map, "tilesloaded", function () {
			console.log("지도 타일 로드 완료");
			map.relayout();
			container.style.display = "block";
			container.style.visibility = "visible";
		});

		// 지도 이동 완료 이벤트 추가
		kakao.maps.event.addListener(map, "dragend", function() {
			console.log("지도 이동 완료");
			if (travelData.length > 0) {
				displaySearchResults(travelData);
			}
		});

		// 지도 줌 레벨 변경 이벤트 추가
		kakao.maps.event.addListener(map, "zoom_changed", function() {
			console.log("지도 줌 레벨 변경");
			if (travelData.length > 0) {
				displaySearchResults(travelData);
			}
		});

		// 추가적인 크기 조정 이벤트
		window.addEventListener(
			"resize",
			function () {
				if (map) {
					map.relayout();
					container.style.display = "block";
					container.style.visibility = "visible";
				}
			},
			{ passive: true }
		);

		// 초기 크기 조정
		requestAnimationFrame(function () {
			if (map) {
				map.relayout();
				container.style.display = "block";
				container.style.visibility = "visible";
			}
		});

		// MutationObserver 설정
		const observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				if (
					mutation.type === "attributes" &&
					(mutation.attributeName === "style" ||
						mutation.attributeName === "class")
				) {
					container.style.display = "block";
					container.style.visibility = "visible";
					if (map) {
						map.relayout();
					}
				}
			});
		});

		observer.observe(container, {
			attributes: true,
			attributeFilter: ["style", "class"],
		});

		places = new kakao.maps.services.Places();
		console.log("Places 서비스 초기화 완료");

		setupCategoryCheckboxes();
		console.log("카테고리 체크박스 설정 완료");

		// 초기 리스트 비우기
		const list = document.getElementById("travel-list");
		if (list) {
			const ul = list.querySelector("ul");
			if (ul) {
				ul.innerHTML = "";
			}
		}

		// 더보기 버튼 숨기기
		const loadMoreButton = document.getElementById("load-more");
		if (loadMoreButton) {
			loadMoreButton.style.display = "none";
		}

		console.log("지도가 성공적으로 초기화되었습니다.");
	} catch (error) {
		console.error("지도 초기화 중 오류 발생:", error);
	}
}

function toggleSelect() {
	console.log('fdas')
	const region = document.getElementById("region").value;
	const button = document.getElementById("compButtons");
	if (region === "") {
		button.disabled = true;
		button.textContent = "지역을 먼저 선택해주세요";
	} else {
		button.disabled = false;
		button.textContent = "탐색하기";
	}
}

// API 데이터 가져오기
async function fetchTravelList() {
	const searchText = document.getElementById("search-text")?.value.trim() || "";
	const region = document.getElementById("region")?.value || "";

	// 검색어나 지역이 없으면 데이터를 가져오지 않음
	if (!searchText && !region) {
		return;
	}

	const listUrl = `https://apis.data.go.kr/B551011/KorPetTourService/areaBasedList?serviceKey=GTr1cI7Wi0FRbOTFBaUzUCzCDP4OnyyEmHnn11pxCUC5ehG5bQnbyztgeydnOWz1O04tjw1SE5RsX8RNo6XCgQ%3D%3D&numOfRows=1000&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json`;
	console.log("📡 브라우저에서 직접 API 요청:", listUrl);
	const response = await fetch(listUrl);
	const apiData = await response.json();
	travelData = apiData.response?.body?.items?.item || [];
	filterAndDisplayList();
}

// 검색 기능
function searchTravelList() {
	currentPage = 1;
	travelData = [];
	filteredData = [];
	fetchTravelList();
}

// 필터링 및 표시
function filterAndDisplayList() {
	const searchInput = document.getElementById("search-text");
	const regionSelect = document.getElementById("region");
	const categoryCheckboxes = document.querySelectorAll(
		".checkbox input:checked"
	);

	// DOM 요소가 없을 경우 기본값 사용
	const searchText = searchInput ? searchInput.value.trim().toLowerCase() : "";
	const region = regionSelect ? regionSelect.value : "";
	const selectedCategories = Array.from(categoryCheckboxes).map(
	  	(checkbox) => checkbox.value
	);

	filteredData = travelData.filter((item) => {
		const matchesText = item.title.toLowerCase().includes(searchText);
		const matchesRegion =
			region === "" || (item.addr1 && item.addr1.includes(region));
		const matchesCategory =
			selectedCategories.length === 0 ||
			selectedCategories.includes(getCategory(item).replace(/[^가-힣]/g, ""));
		return matchesText && matchesRegion && matchesCategory;
	});

	displaySearchResults(filteredData);
	displayTravelList();
}

// 검색 결과 표시
function displaySearchResults(items) {
	removeMarkers();

	if (!items || items.length === 0) {
		const searchResultBox = document.querySelector(".search-result-box ul");
		if (searchResultBox) {
			searchResultBox.innerHTML =
				'<li class="no-result"><p>검색 결과가 없습니다.</p></li>';
		}
		return;
	}

	// 현재 지도의 영역 가져오기
	const bounds = map.getBounds();
	const swLat = bounds.getSouthWest().getLat();
	const swLng = bounds.getSouthWest().getLng();
	const neLat = bounds.getNorthEast().getLat();
	const neLng = bounds.getNorthEast().getLng();

	// 현재 지도 영역 내의 장소만 필터링
	const visibleItems = items.filter((item) => {
		if (!item.mapx || !item.mapy) return false;
		const lat = parseFloat(item.mapy);
		const lng = parseFloat(item.mapx);
		return lat >= swLat && lat <= neLat && lng >= swLng && lng <= neLng;
	});

	// 필터링된 결과로 리스트 업데이트
	filteredData = visibleItems;

	// 마커 생성 및 표시
	visibleItems.forEach((item) => {
		if (item.mapx && item.mapy) {
			const position = new kakao.maps.LatLng(item.mapy, item.mapx);
			const marker = createMarker(
				position,
				item.title,
				item.addr1 + (item.addr2 ? " " + item.addr2 : ""),
				determineCategory(item),
				item
			);
			markers.push(marker);
		}
	});

	// 리스트 표시 업데이트
	displayTravelList();
}

// 여행지 목록 표시
function displayTravelList() {
	const list = document.getElementById("travel-list");
	if (!list) {
		console.log("travel-list 요소가 없습니다. 지도에만 마커를 표시합니다.");
		return;
	}

	const ul = list.querySelector("ul");
	if (!ul) {
		console.log("travel-list 내 ul 요소가 없습니다.");
		return;
	}

	ul.innerHTML = "";

	const start = 0;
	const end = currentPage * itemsPerPage;
	const displayItems = filteredData.slice(start, end);

	displayItems.forEach((item) => {
		const li = document.createElement("li");
		const defaultImage ="https://dummyimage.com/200x200/cccccc/ffffff&text=No+Image";
		const imageUrl = item.firstimage || defaultImage;
		li.innerHTML = `
			<a href="javascript:void(0)" role="button">
				<div class="img-box">
					<div class="category ${getCategoryClass(item)}">${getCategory(item)}</div>
					<img src="${imageUrl}" data-src="${imageUrl}" alt="${item.title}" onerror="this.onerror=null; this.src='${imageUrl}';">
				</div>
				<div class="txts">
					<strong class="main-txt">${item.title}</strong>
					<span class="sub-txt">${item.addr1 || "주소 정보 없음"}</span>
				</div>
			</a>
		`;

		// 이미지 로드 시도
		const img = li.querySelector("img");
		if (img) {
			img.onload = function () {
				if (this.src !== defaultImage) {
					this.src = this.getAttribute("data-src");
				}
			};
			img.onerror = function () {
				this.src = defaultImage;
			};
		}

		li.addEventListener("click", () => openDetailModal(item));
		ul.appendChild(li);
	});

	const loadMoreButton = document.getElementById("load-more");
	if (loadMoreButton) {
		if (end < filteredData.length) {
			loadMoreButton.style.display = "inline-block";
		} else {
			loadMoreButton.style.display = "none";
		}
	}
}

function determineCategory(place) {
	const contentTypeId = place.contenttypeid;
	switch (contentTypeId) {
		case "32":
			return "AD5"; // 숙소
		case "39":
			return "FD6"; // 식당
		case "12":
		case "28":
			return "AT4"; // 명소
		default:
			return "CE7"; // 카페
	}
}

// 마커 관련 함수들
function createMarker(position, title, address, category, place) {
	const marker = new kakao.maps.Marker({
	  position: position,
	  map: map,
	  title: title,
	});

	const content = `
	  <div style="padding:5px;font-size:12px;">
		  <strong>${title}</strong><br>
		  ${address}<br>
		  <span style="color:${CATEGORY_CONFIG[category].color}">${CATEGORY_CONFIG[category].name}</span>
	  </div>
	`;

	const infowindow = new kakao.maps.InfoWindow({
	  content: content,
	  zIndex: 1,
	});

	kakao.maps.event.addListener(marker, "click", function () {
	  if (currentInfoWindow) {
		  currentInfoWindow.close();
	  }
	  infowindow.open(map, marker);
	  currentInfoWindow = infowindow;

	  // 이전에 선택된 마커가 있다면 원래 색상으로 변경
	  if (selectedMarker) {
		  selectedMarker.setZIndex(1);
	  }

	  // 현재 마커를 선택된 마커로 설정
	  selectedMarker = marker;
	  selectedPlace = place;
	  marker.setZIndex(2);

	  // 루트 추가하기 버튼 활성화
	  const addRouteBtn = document.querySelector('.comp-buttons button');
	  if (addRouteBtn) {
		  addRouteBtn.disabled = false;
		  addRouteBtn.onclick = () => {
			  if (selectedPlace) {
				  addToRoute(selectedPlace);
			  }
		  };
	  }
	});

	return marker;
}

function removeMarkers() {
	markers.forEach((marker) => marker.setMap(null));
	markers = [];
}

// 더보기 기능
function loadMore() {
  currentPage++;
  displayTravelList();
}

// 카테고리 관련 함수들
function getCategoryClass(item) {
	const type = item.contenttypeid;
	if (type === "32") return "lodging";
	if (type === "39") return "cafe";
	if (type === "12" || type === "28") return "activity";
	return "etc";
}

function getCategory(item) {
	const type = getCategoryClass(item);
	if (type === "lodging") return "🏨 숙박";
	if (type === "cafe") return "☕🍴 음식점";
	if (type === "activity") return "🎢 놀거리";
	return "📌 기타";
}

// 모달 관련 함수들
function openDetailModal(item) {
	const modal = document.getElementById("detail");
	const swiperWrapper = modal.querySelector(".swiper-wrapper");
	const defaultImage = "https://dummyimage.com/200x200/cccccc/ffffff&text=No+Image";
	const imageUrl = item.firstimage || defaultImage;

	swiperWrapper.innerHTML = `
		<div class="swiper-slide">
			<img src="${imageUrl}" data-src="${imageUrl}" alt="${item.title}" onerror="this.onerror=null; this.src='${imageUrl}';">
		</div>
	`;

	// 이미지 로드 시도
	const img = swiperWrapper.querySelector("img");
	if (img) {
		img.onload = function () {
			if (this.src !== defaultImage) {
				this.src = this.getAttribute("data-src");
			}
		};
		img.onerror = function () {
			this.src = defaultImage;
		};
	}

	const details = modal.querySelectorAll(".details dd");
	details[0].textContent = item.title || "-";
	details[1].textContent = item.addr1 || "-";
	details[2].textContent = item.tel || "-";
	details[3].textContent = getCategory(item) || "-";
	modal.style.display = "block";
	detailImgs()
}

// 이벤트 리스너 설정
function setupEventListeners() {
	// 검색창 엔터키 이벤트
	const searchInput = document.getElementById("search-text");
	if (searchInput) {
		searchInput.addEventListener(
			"keydown",
			(e) => {
				if (e.key === "Enter") {
					searchTravelList();
				}
			},
			{ passive: true }
		);
	}

	// 검색 버튼 이벤트
	const searchButton = document.querySelector(".comp-buttons button");
	if (searchButton) {
	  	searchButton.addEventListener("click", searchTravelList, { passive: true });
	}

	// 지역 선택 이벤트
	const regionSelect = document.getElementById("region");
	if (regionSelect) {
		regionSelect.addEventListener(
			"change",
			function () {
				const selectedRegion = this.value;
				if (selectedRegion && REGION_COORDS[selectedRegion]) {
					const coords = REGION_COORDS[selectedRegion];
					map.setCenter(new kakao.maps.LatLng(coords.lat, coords.lng));
					map.setLevel(8);
					searchTravelList();
				}
			},
			{ passive: true }
		);
	}

	// 스크롤 이벤트
	window.addEventListener("scroll", () => {
		if (map) {
		map.relayout();
		}
	},
		{ passive: true }
	);

	// 지도 이동 이벤트 추가
	kakao.maps.event.addListener(map, "bounds_changed", function () {
		if (filteredData.length > 0) {
			displaySearchResults(filteredData);
		}
	});
}

// 카테고리 체크박스 설정
function setupCategoryCheckboxes() {
	const checkboxes = document.querySelectorAll(
	  '.checkbox input[type="checkbox"]'
	);
	checkboxes.forEach((checkbox) => {
	  checkbox.addEventListener(
		  "change",
		  function () {
			searchTravelList();
		  },
		  { passive: true }
	  );
	});
}

document.getElementById("text1").addEventListener("keydown", (e) => {
	if (e.key === "Enter") {
		searchTravelList();
	}
});

// 페이지 로드 시 초기화
window.addEventListener("load", () => {
	  console.log("페이지 로드 완료");
	  // 카카오맵 SDK 로드 확인
	  if (typeof kakao === "undefined" || !kakao.maps) {
			console.error("카카오맵 SDK가 로드되지 않았습니다.");
			return;
	  }
	  const mapContainer = document.getElementById("map");
	  if (mapContainer) {
			console.log("지도 컨테이너를 찾았습니다.");
			initMap();
			setupEventListeners();
			setupCategoryCheckboxes();
	  } else {
			console.error("지도 컨테이너를 찾을 수 없습니다.");
	  }
});

// 루트에 장소 추가 함수
function addToRoute(place) {
    const routeList = document.querySelector('.make-route');
    const placeholder = routeList.querySelector('.item.-placeholder');
    
    if (placeholder) {
        placeholder.remove();
    }

    const routeItem = document.createElement('div');
    routeItem.className = 'item';
    routeItem.innerHTML = `
        <div class="sorting-handler"></div>
        <figure class="img-box">
            <img src="${place.firstimage || '/assets/imgs/temp/temp-list2.jpg'}" alt="${place.title}">
        </figure>
        <div class="infos">
            <h3 class="name">${place.title}</h3>
            <dl class="info">
                <dt>주소</dt>
                <dd>${place.addr1 || '-'}</dd>
                <dt>전화</dt>
                <dd>${place.tel || '-'}</dd>
                <dt>날짜</dt>
                <dd>${document.getElementById('text3')?.value || '-'}</dd>
                <dt>시간</dt>
                <dd>${new Date().toLocaleTimeString()}</dd>
            </dl>
        </div>
        <div class="button-set">
            <button type="button" class="button" onclick="deleteData(this, '.item')">삭제하기</button>
        </div>
    `;

    routeList.appendChild(routeItem);

    // 선택된 마커 초기화
    if (selectedMarker) {
        selectedMarker.setZIndex(1);
        selectedMarker = null;
    }
    selectedPlace = null;

    // 루트 추가하기 버튼 비활성화
    const addRouteBtn = document.querySelector('.comp-buttons button');
    if (addRouteBtn) {
        addRouteBtn.disabled = true;
    }
}