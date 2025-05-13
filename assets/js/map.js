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
      // 지도 크기 재조정
      map.relayout();
      // 지도 컨테이너가 보이도록 강제
      container.style.display = "block";
      container.style.visibility = "visible";
    });

    // 추가적인 크기 조정 이벤트 (passive 옵션 추가)
    window.addEventListener(
      "resize",
      function () {
        if (map) {
          map.relayout();
          // 지도 컨테이너가 보이도록 강제
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
        // 지도 컨테이너가 보이도록 강제
        container.style.display = "block";
        container.style.visibility = "visible";
      }
    });

    // MutationObserver를 사용하여 지도 컨테이너의 변경 감지
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
  console.log("fdas");
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
        determineCategory(item)
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
    console.warn("travel-list 요소를 찾을 수 없습니다.");
    return;
  }

  const ul = list.querySelector("ul");
  if (!ul) {
    console.warn("travel-list 내의 ul 요소를 찾을 수 없습니다.");
    return;
  }

  ul.innerHTML = "";

  const start = 0;
  const end = currentPage * itemsPerPage;
  const displayItems = filteredData.slice(start, end);

  displayItems.forEach((item) => {
    const li = document.createElement("li");
    const defaultImage =
      "https://dummyimage.com/200x200/cccccc/ffffff&text=No+Image";
    const imageUrl = item.firstimage || defaultImage;
    li.innerHTML = `
      <a href="javascript:void(0)" role="button">
        <div class="img-box">
          <div class="category ${getCategoryClass(item)}">${getCategory(
      item
    )}</div>
          <img src="${imageUrl}" data-src="${imageUrl}" alt="${
      item.title
    }" onerror="this.onerror=null; this.src='${imageUrl}';">
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
function createMarker(position, title, address, category, isSelected = false) {
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

    // 마커 클릭 시 선택된 장소 저장
    const selectedPlace = {
      title: title,
      address: address,
      category: CATEGORY_CONFIG[category].name,
      position: position,
      marker: marker,
    };
    window.selectedPlace = selectedPlace;
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
  const defaultImage =
    "https://dummyimage.com/200x200/cccccc/ffffff&text=No+Image";
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
  detailImgs();
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
  window.addEventListener(
    "scroll",
    () => {
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

  // 최적화 버튼 이벤트
  const optimizeButton = document.getElementById("optimize-route");
  if (optimizeButton) {
    optimizeButton.addEventListener("click", optimizeRoute);
  }
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
    loadMapData(); // 저장된 지도 데이터 로드
  } else {
    console.error("지도 컨테이너를 찾을 수 없습니다.");
  }
});

// 루트에 장소 추가
function addToRoute(place) {
  if (!place) return;

  const routeContainer = document.querySelector(".make-route");
  if (!routeContainer) return;

  // 이미 추가된 장소인지 확인
  const existingItems = routeContainer.querySelectorAll(".item");
  for (const item of existingItems) {
    const itemTitle = item.querySelector(".name")?.textContent;
    if (itemTitle === place.title) {
      alert("이미 추가된 장소입니다.");
      return;
    }
  }

  // 새로운 장소 아이템 생성
  const item = document.createElement("div");
  item.className = "item";
  item.innerHTML = `
    <div class="sorting-handler"></div>
    <figure class="img-box">
      <img src="${place.firstimage || "/assets/imgs/temp/temp1.png"}" alt="${
    place.title
  }">
    </figure>
    <div class="infos">
      <h3 class="name">${place.title}</h3>
      <dl class="info">
        <dt>주소</dt><dd>${place.address || "-"}</dd>
        <dt>카테고리</dt><dd>${place.category || "-"}</dd>
        <dt>날짜</dt><dd>${document.getElementById("text3")?.value || "-"}</dd>
        <dt>시간</dt><dd>${new Date().toLocaleTimeString()}</dd>
      </dl>
    </div>
    <div class="button-set">
      <button type="button" class="button" onclick="deleteRouteItem(this)">
        삭제하기
      </button>
    </div>
  `;

  // 플레이스홀더 제거
  const placeholder = routeContainer.querySelector(".item.-placeholder");
  if (placeholder) {
    placeholder.remove();
  }

  routeContainer.appendChild(item);

  // 정렬 기능 초기화
  if (typeof $ !== "undefined" && $.fn.sortable) {
    $(".make-route").sortable({
      handle: ".sorting-handler",
      placeholder: "item -placeholder",
      update: function () {
        updateRoute();
      },
    });
  }
}

// 루트 아이템 삭제
function deleteRouteItem(button) {
  const item = button.closest(".item");
  if (item) {
    item.remove();

    // 모든 아이템이 삭제되면 플레이스홀더 추가
    const routeContainer = document.querySelector(".make-route");
    if (routeContainer && !routeContainer.querySelector(".item")) {
      routeContainer.innerHTML = '<div class="item -placeholder"></div>';
    }
  }
}

// 루트 업데이트
function updateRoute() {
  const items = document.querySelectorAll(".make-route .item");
  const route = Array.from(items).map((item) => ({
    title: item.querySelector(".name")?.textContent,
    address: item.querySelector(".info dd")?.textContent,
    category: item.querySelectorAll(".info dd")[1]?.textContent,
    date: item.querySelectorAll(".info dd")[2]?.textContent,
    time: item.querySelectorAll(".info dd")[3]?.textContent,
  }));

  // 여기서 route 데이터를 서버에 저장하거나 필요한 처리를 할 수 있습니다
  console.log("Updated route:", route);
}

// 경로 최적화 함수
function optimizeRoute() {
  const routeContainer = document.querySelector(".make-route");
  if (!routeContainer) return;

  const items = routeContainer.querySelectorAll(".item");
  if (items.length < 2) {
    alert("최적화를 위해서는 2개 이상의 장소가 필요합니다.");
    return;
  }

  // 기존 마커와 경로선 제거
  removeMarkers();
  if (polyline) {
    polyline.setMap(null);
  }

  // 리스트의 장소 정보 수집
  const places = Array.from(items).map((item) => {
    const title = item.querySelector(".name")?.textContent;
    const address = item.querySelector(".info dd")?.textContent;
    const category = item.querySelectorAll(".info dd")[1]?.textContent;
    const date = item.querySelectorAll(".info dd")[2]?.textContent;
    const time = item.querySelectorAll(".info dd")[3]?.textContent;

    // 주소로 좌표 검색
    return new Promise((resolve) => {
      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.addressSearch(address, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const position = new kakao.maps.LatLng(result[0].y, result[0].x);
          resolve({
            title,
            address,
            category,
            date,
            time,
            position,
            element: item,
          });
        } else {
          resolve(null);
        }
      });
    });
  });

  // 모든 장소의 좌표를 가져온 후 최적화 실행
  Promise.all(places).then((placesWithCoords) => {
    const validPlaces = placesWithCoords.filter((place) => place !== null);

    if (validPlaces.length < 2) {
      alert("유효한 위치 정보가 부족합니다.");
      return;
    }

    // TSP 알고리즘으로 최적 경로 계산
    const optimizedOrder = calculateOptimalRoute(validPlaces);

    // 최적화된 순서로 마커 표시 및 경로선 그리기
    const optimizedMarkers = [];
    const pathPositions = [];

    optimizedOrder.forEach((place, index) => {
      // 마커 생성
      const marker = new kakao.maps.Marker({
        position: place.position,
        map: map,
        title: place.title,
      });

      // 인포윈도우 생성
      const content = `
        <div style="padding:5px;font-size:12px;">
          <strong>${place.title}</strong><br>
          ${place.address}<br>
          <span style="color:#FF6B6B">${place.category}</span><br>
          ${place.date} ${place.time}
        </div>
      `;

      const infowindow = new kakao.maps.InfoWindow({
        content: content,
        zIndex: 1,
      });

      // 마커 클릭 이벤트
      kakao.maps.event.addListener(marker, "click", function () {
        if (currentInfoWindow) {
          currentInfoWindow.close();
        }
        infowindow.open(map, marker);
        currentInfoWindow = infowindow;
      });

      optimizedMarkers.push(marker);
      pathPositions.push(place.position);
    });

    // 경로선 그리기
    polyline = new kakao.maps.Polyline({
      path: pathPositions,
      strokeWeight: 5,
      strokeColor: "#FF0000",
      strokeOpacity: 0.7,
      strokeStyle: "solid",
    });
    polyline.setMap(map);

    // 리스트 순서 업데이트
    const routeList = document.querySelector(".make-route");
    routeList.innerHTML = '<div class="item -placeholder"></div>';

    optimizedOrder.forEach((place) => {
      if (place.element) {
        routeList.appendChild(place.element);
      }
    });

    // 지도 영역 조정
    const bounds = new kakao.maps.LatLngBounds();
    pathPositions.forEach((position) => bounds.extend(position));
    map.setBounds(bounds);

    // 정렬 기능 재초기화
    if (typeof $ !== "undefined" && $.fn.sortable) {
      $(".make-route").sortable({
        handle: ".sorting-handler",
        placeholder: "item -placeholder",
        update: function () {
          updateRoute();
        },
      });
    }

    // 최적화 완료 후 지도 데이터 저장
    saveMapData();
  });
}

// TSP 알고리즘 (Nearest Neighbor)
function calculateOptimalRoute(places) {
  const result = [places[0]]; // 시작점 추가
  const remaining = places.slice(1);

  while (remaining.length > 0) {
    const current = result[result.length - 1];
    let nearest = null;
    let minDistance = Infinity;
    let nearestIndex = -1;

    for (let i = 0; i < remaining.length; i++) {
      const distance = calculateDistance(
        current.position.getLat(),
        current.position.getLng(),
        remaining[i].position.getLat(),
        remaining[i].position.getLng()
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearest = remaining[i];
        nearestIndex = i;
      }
    }

    if (nearest) {
      result.push(nearest);
      remaining.splice(nearestIndex, 1);
    }
  }

  return result;
}

// 두 지점 간의 거리 계산 (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // 지구의 반경 (km)
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

// 지도 데이터 저장 함수
function saveMapData() {
  const mapData = {
    markers: markers.map((marker) => ({
      title: marker.getTitle(),
      position: {
        lat: marker.getPosition().getLat(),
        lng: marker.getPosition().getLng(),
      },
    })),
    polyline: polyline
      ? {
          path: polyline
            .getPath()
            .getArray()
            .map((point) => ({
              lat: point.getLat(),
              lng: point.getLng(),
            })),
        }
      : null,
    center: {
      lat: map.getCenter().getLat(),
      lng: map.getCenter().getLng(),
    },
    level: map.getLevel(),
  };

  localStorage.setItem("mapData", JSON.stringify(mapData));
}

// 지도 데이터 불러오기 함수
function loadMapData() {
  const savedData = localStorage.getItem("mapData");
  if (!savedData) return;

  const mapData = JSON.parse(savedData);

  // 기존 마커와 경로선 제거
  removeMarkers();
  if (polyline) {
    polyline.setMap(null);
  }

  // 마커 복원
  mapData.markers.forEach((markerData) => {
    const position = new kakao.maps.LatLng(
      markerData.position.lat,
      markerData.position.lng
    );
    const marker = new kakao.maps.Marker({
      position: position,
      map: map,
      title: markerData.title,
    });
    markers.push(marker);
  });

  // 경로선 복원
  if (mapData.polyline) {
    const path = mapData.polyline.path.map(
      (point) => new kakao.maps.LatLng(point.lat, point.lng)
    );
    polyline = new kakao.maps.Polyline({
      path: path,
      strokeWeight: 5,
      strokeColor: "#FF0000",
      strokeOpacity: 0.7,
      strokeStyle: "solid",
    });
    polyline.setMap(map);
  }

  // 지도 중심점과 레벨 복원
  const center = new kakao.maps.LatLng(mapData.center.lat, mapData.center.lng);
  map.setCenter(center);
  map.setLevel(mapData.level);
}
