// map.js
// 카카오맵 API 초기화 및 지도 생성
let map;
let markers = [];
let routeMarkers = [];
let selectedPlaces = [];
let polyline;
let places; // Places 서비스 객체

// 선택된 마커를 저장할 변수
let selectedMarker = null;

// 현재 열려있는 정보창을 저장할 전역 변수
let currentInfoWindow = null;

// 카테고리 설정
const CATEGORY_CONFIG = {
  AD5: { name: "숙소", keyword: "애견동반숙소", color: "#FF6B6B" },
  FD6: { name: "식당", keyword: "애견동반식당", color: "#4ECDC4" },
  CE7: { name: "카페", keyword: "애견동반카페", color: "#45B7D1" },
  AT4: { name: "명소", keyword: "애견동반명소", color: "#96CEB4" },
};

// 지역별 중심 좌표 정의
const REGION_COORDS = {
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

function initMap() {
  const container = document.getElementById("map");
  const options = {
    center: new kakao.maps.LatLng(37.566826, 126.9786567),
    level: 8,
  };
  map = new kakao.maps.Map(container, options);
  places = new kakao.maps.services.Places(); // Places 서비스 초기화
  setupCategoryCheckboxes(); // 카테고리 체크박스 설정
}

// 카테고리 체크박스 설정 함수
function setupCategoryCheckboxes() {
  const checkboxes = document.querySelectorAll(
    'input[type="checkbox"][data-category]'
  );
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const category = this.dataset.category;
      if (this.checked) {
        searchByCategory(category);
      } else {
        removeMarkers();
        const searchResultBox = document.querySelector(".search-result-box ul");
        if (searchResultBox) {
          searchResultBox.innerHTML = "";
        }
      }
    });
  });
}

// 카테고리별 검색 함수
function searchByCategory(categoryCode) {
  const selectedRegion = document.getElementById("region").value;
  if (!selectedRegion) {
    alert("지역을 선택해주세요.");
    return;
  }

  const options = {
    location: REGION_COORDS[selectedRegion],
    radius: 5000,
    category_group_code: categoryCode,
  };

  places.categorySearch(
    categoryCode,
    (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        displayPlaces(data);

        if (data.length > 0) {
          const bounds = new kakao.maps.LatLngBounds();
          data.forEach((place) => {
            bounds.extend(new kakao.maps.LatLng(place.y, place.x));
          });
          map.setBounds(bounds);
        }
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert("검색 결과가 없습니다.");
      } else if (status === kakao.maps.services.Status.ERROR) {
        alert("검색 중 오류가 발생했습니다.");
      }
    },
    options
  );
}

// 마커 생성 함수 수정
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
    // 이전에 열려있던 정보창이 있다면 닫기
    if (currentInfoWindow) {
      currentInfoWindow.close();
    }
    // 새로운 정보창 열기
    infowindow.open(map, marker);
    // 현재 열린 정보창 저장
    currentInfoWindow = infowindow;
  });

  return marker;
}

// 카테고리 결정 함수
function determineCategory(place) {
  const categoryName = place.category_name;
  if (categoryName.includes("숙소") || place.category_group_code === "AD5")
    return "AD5";
  if (categoryName.includes("식당") || place.category_group_code === "FD6")
    return "FD6";
  if (categoryName.includes("카페") || place.category_group_code === "CE7")
    return "CE7";
  return "AT4";
}

// 마커 제거 함수
function removeMarkers() {
  markers.forEach((marker) => marker.setMap(null));
  markers = [];
}

// 경로 그리기 함수
function drawRoute() {
  removeRouteMarkers();

  if (selectedPlaces.length > 1) {
    const path = selectedPlaces.map(
      (place) => new kakao.maps.LatLng(place.y, place.x)
    );
    polyline = new kakao.maps.Polyline({
      path: path,
      strokeWeight: 5,
      strokeColor: "#3498db",
      map: map,
    });

    // 경로 마커 추가
    selectedPlaces.forEach((place) => {
      const marker = addMarker(new kakao.maps.LatLng(place.y, place.x));
      routeMarkers.push(marker);
    });
  }
}

// 경로 마커 제거 함수
function removeRouteMarkers() {
  if (polyline) {
    polyline.setMap(null);
    polyline = null;
  }
  routeMarkers.forEach((marker) => marker.setMap(null));
  routeMarkers = [];
}

// 선택한 장소 추가 함수
function addPlaceToRoute(place) {
  selectedPlaces.push(place);
  updateRouteList();
  drawRoute();
}

// 선택한 장소 목록 업데이트 함수
function updateRouteList() {
  const routeList = document.getElementById("route-list");
  if (routeList) {
    routeList.innerHTML = "";
    selectedPlaces.forEach((place, index) => {
      const li = document.createElement("li");
      li.classList.add("route-item");
      li.innerHTML = `
        <span class="route-item-name">${index + 1}. ${place.place_name}</span>
        <button class="route-item-button" data-index="${index}">삭제</button>
      `;
      routeList.appendChild(li);
    });
  }
}

// 경로 초기화 함수
function clearRoute() {
  selectedPlaces = [];
  updateRouteList();
  removeRouteMarkers();
}

// 경로 최적화 함수
function optimizeRoute() {
  // 최적화 로직 구현
}

// 지역명 추출 함수
function extractRegionFromKeyword(keyword) {
  const regionPatterns = {
    서울: ["서울", "서울시", "서울특별시"],
    부산: ["부산", "부산시", "부산광역시"],
    대구: ["대구", "대구시", "대구광역시"],
    인천: ["인천", "인천시", "인천광역시"],
    광주: ["광주", "광주시", "광주광역시"],
    대전: ["대전", "대전시", "대전광역시"],
    울산: ["울산", "울산시", "울산광역시"],
    세종: ["세종", "세종시", "세종특별자치시"],
    경기: ["경기", "경기도"],
    강원: ["강원", "강원도", "강원특별자치도"],
    충북: ["충북", "충청북도"],
    충남: ["충남", "충청남도"],
    전북: ["전북", "전라북도"],
    전남: ["전남", "전라남도"],
    경북: ["경북", "경상북도"],
    경남: ["경남", "경상남도"],
    제주: ["제주", "제주도", "제주특별자치도"],
  };

  for (const [region, patterns] of Object.entries(regionPatterns)) {
    if (patterns.some((pattern) => keyword.includes(pattern))) {
      return region;
    }
  }
  return null;
}

// 검색 기능 함수
function searchPlaces() {
  const searchKeyword = document.getElementById("searchPlace").value;
  const selectedRegion = document.getElementById("region").value;
  const selectedCategories = Array.from(
    document.querySelectorAll('input[type="checkbox"][data-category]:checked')
  ).map((checkbox) => checkbox.dataset.category);

  if (!searchKeyword && selectedCategories.length === 0 && !selectedRegion) {
    alert("검색어를 입력하거나 카테고리를 선택하거나 지역을 선택해주세요.");
    return;
  }

  // 검색 옵션 설정
  const options = {
    radius: 5000,
  };

  if (selectedRegion) {
    options.location = REGION_COORDS[selectedRegion];
  } else {
    options.location = map.getCenter();
  }

  // 검색어와 카테고리가 모두 있는 경우
  if (searchKeyword && selectedCategories.length > 0) {
    searchWithBoth(searchKeyword, selectedCategories, options);
  }
  // 검색어만 있는 경우
  else if (searchKeyword) {
    searchWithKeyword(searchKeyword, options);
  }
  // 카테고리만 있는 경우
  else if (selectedCategories.length > 0) {
    searchWithCategories(selectedCategories, options);
  }
  // 지역만 선택된 경우
  else if (selectedRegion) {
    searchWithRegion(selectedRegion, options);
  }
}

// 검색어로만 검색
function searchWithKeyword(keyword, options) {
  const extractedRegion = extractRegionFromKeyword(keyword);
  if (extractedRegion) {
    // 지역명이 포함된 경우 해당 지역으로 지도 이동
    const regionCoords =
      REGION_COORDS[
        Object.keys(REGION_COORDS).find((key) => key.includes(extractedRegion))
      ];
    if (regionCoords) {
      map.setCenter(regionCoords);
      map.setLevel(6);
      options.location = regionCoords;
    }
  }

  // 검색어로 검색 (모든 결과 표시)
  places.keywordSearch(
    keyword,
    (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        // 현재 지도 영역 내의 장소만 필터링
        const filteredResults = data.filter((place) => {
          const placeLatLng = new kakao.maps.LatLng(place.y, place.x);
          return map.getBounds().contain(placeLatLng);
        });
        displayResults(filteredResults);
      } else {
        displayResults([]);
      }
    },
    options
  );
}

// 카테고리로만 검색
function searchWithCategories(categories, options) {
  let allResults = [];
  let completedSearches = 0;

  categories.forEach((category) => {
    places.categorySearch(
      category,
      (data, status) => {
        if (status === kakao.maps.services.Status.OK) {
          // 현재 지도 영역 내의 장소만 필터링
          const filteredResults = data.filter((place) => {
            const placeLatLng = new kakao.maps.LatLng(place.y, place.x);
            return map.getBounds().contain(placeLatLng);
          });
          allResults = allResults.concat(filteredResults);
        }
        completedSearches++;
        if (completedSearches === categories.length) {
          displayResults(allResults);
        }
      },
      options
    );
  });
}

// 지역 선택으로만 검색
function searchWithRegion(region, options) {
  const categories = Object.keys(CATEGORY_CONFIG);
  let allResults = [];
  let completedSearches = 0;

  categories.forEach((category) => {
    const categoryOptions = {
      ...options,
      category_group_code: category,
    };

    places.categorySearch(
      category,
      (data, status) => {
        if (status === kakao.maps.services.Status.OK) {
          // 각 카테고리별로 5개씩만 선택
          const categoryResults = data.slice(0, 5);
          allResults = allResults.concat(categoryResults);
        }
        completedSearches++;
        if (completedSearches === categories.length) {
          displayResults(allResults);
        }
      },
      categoryOptions
    );
  });
}

// 검색어와 카테고리 모두로 검색
function searchWithBoth(keyword, categories, options) {
  let allResults = [];
  let completedSearches = 0;

  // 검색어로 검색
  places.keywordSearch(
    keyword,
    (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        // 카테고리로 필터링
        const filteredResults = data.filter((place) =>
          categories.includes(determineCategory(place))
        );
        allResults = allResults.concat(filteredResults);
      }
      completedSearches++;
      if (completedSearches === 1) {
        displayResults(allResults);
      }
    },
    options
  );

  // 카테고리로 검색
  categories.forEach((category) => {
    places.categorySearch(
      category,
      (data, status) => {
        if (status === kakao.maps.services.Status.OK) {
          // 검색어로 필터링
          const filteredResults = data.filter(
            (place) =>
              place.place_name.includes(keyword) ||
              place.address_name.includes(keyword) ||
              place.road_address_name?.includes(keyword)
          );
          allResults = allResults.concat(filteredResults);
        }
        completedSearches++;
        if (completedSearches === categories.length + 1) {
          displayResults(allResults);
        }
      },
      options
    );
  });
}

// 지도 드래그 이벤트 처리
function setupMapDragEvent() {
  kakao.maps.event.addListener(map, "dragend", function () {
    const center = map.getCenter();
    const bounds = map.getBounds();
    const swLatLng = bounds.getSouthWest();
    const neLatLng = bounds.getNorthEast();

    // 현재 지도 중심의 주소 정보 가져오기
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.coord2Address(
      center.getLng(),
      center.getLat(),
      function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
          const address = result[0].address;
          const region = address.region_1depth_name;
          const subRegion = address.region_2depth_name;

          // 현재 검색어 가져오기
          const currentKeyword = document.getElementById("searchPlace").value;

          // 새로운 검색 수행
          searchInNewRegion(currentKeyword, region, subRegion, center);
        }
      }
    );
  });
}

// 새로운 지역에서 검색 수행
function searchInNewRegion(keyword, region, subRegion, center) {
  const options = {
    location: center,
    radius: 5000,
  };

  // 각 카테고리별로 검색
  const categories = Object.keys(CATEGORY_CONFIG);
  let allResults = [];
  let completedSearches = 0;

  categories.forEach((category) => {
    const categoryOptions = {
      ...options,
      category_group_code: category,
    };

    // 검색어가 있는 경우 키워드 검색, 없는 경우 카테고리 검색
    const searchFunction = keyword
      ? (callback) => places.keywordSearch(keyword, callback, categoryOptions)
      : (callback) =>
          places.categorySearch(category, callback, categoryOptions);

    searchFunction((data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        // 현재 지도 영역 내의 장소만 필터링
        const filteredResults = data.filter((place) => {
          const placeLatLng = new kakao.maps.LatLng(place.y, place.x);
          return map.getBounds().contain(placeLatLng);
        });

        // 각 카테고리별로 4개씩만 선택
        const categoryResults = filteredResults
          .filter((place) => determineCategory(place) === category)
          .slice(0, 4);

        allResults = allResults.concat(categoryResults);
      }
      completedSearches++;
      if (completedSearches === categories.length) {
        displayResults(allResults);
      }
    });
  });
}

// 검색 결과 표시
function displayResults(results) {
  // 중복 제거
  const uniqueResults = Array.from(
    new Set(results.map((place) => place.id))
  ).map((id) => results.find((place) => place.id === id));

  // 각 카테고리별로 마커 생성 및 표시
  removeMarkers();
  const searchResultBox = document.querySelector(".search-result-box ul");
  if (searchResultBox) {
    searchResultBox.innerHTML = "";
  }

  if (uniqueResults.length === 0) {
    if (searchResultBox) {
      searchResultBox.innerHTML =
        '<li class="no-result"><p>검색 결과가 없습니다.</p></li>';
    }
    return;
  }

  // 카테고리별로 결과 그룹화
  const groupedResults = uniqueResults.reduce((acc, place) => {
    const category = determineCategory(place);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(place);
    return acc;
  }, {});

  Object.entries(groupedResults).forEach(([category, places]) => {
    places.forEach((place) => {
      const marker = createMarker(
        new kakao.maps.LatLng(place.y, place.x),
        place.place_name,
        place.address_name,
        category
      );
      markers.push(marker);

      if (searchResultBox) {
        const li = document.createElement("li");
        li.innerHTML = `
          <a href="#none" role="button" onclick="selectPlace({
            id: '${place.id}',
            place_name: '${place.place_name}',
            y: ${place.y},
            x: ${place.x},
            address_name: '${place.address_name}',
            category: '${category}'
          })">
            <div class="img-box">
              <div class="flags">
                <span class="flag -color3">${
                  CATEGORY_CONFIG[category].name
                }</span>
              </div>
              <img src="../../assets/imgs/temp/temp-list2.jpg" alt="" />
            </div>
            <div class="txts">
              <strong class="main-txt">${place.place_name}</strong>
              <span class="sub-txt">${
                place.road_address_name || place.address_name
              }</span>
              <button type="button" class="button -primary -sm" onclick="event.stopPropagation(); showLocationDetail({
                title: '${place.place_name}',
                address: '${place.road_address_name || place.address_name}',
                petTypes: '강아지/고양이',
                phone: '${place.phone || "정보 없음"}',
                homepage: '${place.homepage || "정보 없음"}',
                hours: '${place.hours || "정보 없음"}',
                parking: '${place.parking || "정보 없음"}',
                additional: '${place.additional || "정보 없음"}',
                images: [
                  '../../assets/imgs/temp/temp1.png',
                  '../../assets/imgs/temp/temp2.png',
                  '../../assets/imgs/temp/temp3.png',
                  '../../assets/imgs/temp/temp4.jpg',
                  '../../assets/imgs/temp/temp5.jpg',
                  '../../assets/imgs/temp/temp6.jpg'
                ]
              })">상세보기</button>
            </div>
          </a>
        `;

        searchResultBox.appendChild(li);
      }
    });
  });

  // 지도 범위 조정
  const bounds = new kakao.maps.LatLngBounds();
  uniqueResults.forEach((place) => {
    bounds.extend(new kakao.maps.LatLng(place.y, place.x));
  });
  map.setBounds(bounds);
}

// 장소 상세 정보 표시 함수
function showPlaceDetail(place) {
  // 상세 정보를 표시할 모달 생성
  const modal = document.createElement("div");
  modal.className = "place-detail-modal";
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>${place.place_name}</h2>
        <button class="close-button">&times;</button>
      </div>
      <div class="modal-body">
        <div class="place-info">
          <div class="info-section">
            <h3>기본 정보</h3>
            <p><strong>주소:</strong> ${
              place.road_address_name || place.address_name
            }</p>
            <p><strong>카테고리:</strong> ${
              CATEGORY_CONFIG[determineCategory(place)].name
            }</p>
            <p><strong>전화번호:</strong> ${place.phone || "정보 없음"}</p>
          </div>
          <div class="info-section">
            <h3>위치 정보</h3>
            <div id="detail-map" style="width:100%;height:300px;"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  // 모달을 body에 추가
  document.body.appendChild(modal);

  // 닫기 버튼 이벤트
  const closeButton = modal.querySelector(".close-button");
  closeButton.addEventListener("click", () => {
    document.body.removeChild(modal);
  });

  // 모달 외부 클릭 시 닫기
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });

  // 상세 지도 생성
  const detailMapContainer = modal.querySelector("#detail-map");
  const detailMap = new kakao.maps.Map(detailMapContainer, {
    center: new kakao.maps.LatLng(place.y, place.x),
    level: 3,
  });

  // 상세 지도에 마커 추가
  const detailMarker = new kakao.maps.Marker({
    position: new kakao.maps.LatLng(place.y, place.x),
    map: detailMap,
  });

  // 정보창 생성
  const infowindow = new kakao.maps.InfoWindow({
    content: `<div style="padding:5px;font-size:12px;">${place.place_name}</div>`,
  });
  infowindow.open(detailMap, detailMarker);
}

// 장소 선택 함수 수정
function selectPlace(place) {
  // 이전에 선택된 마커가 있다면 제거
  if (selectedMarker) {
    selectedMarker.setMap(null);
  }

  // 새로운 선택된 마커 생성
  const position = new kakao.maps.LatLng(place.y, place.x);
  selectedMarker = createMarker(
    position,
    place.place_name,
    place.address_name,
    place.category,
    true
  );

  // 선택된 장소로 지도 이동
  map.setCenter(position);
  map.setLevel(3);

  // 선택된 장소의 정보창 표시
  const content = `
    <div style="padding:5px;font-size:12px;">
      <strong>${place.place_name}</strong><br>
      ${place.address_name}<br>
      <span style="color:${CATEGORY_CONFIG[place.category].color}">${
    CATEGORY_CONFIG[place.category].name
  }</span>
    </div>
  `;

  const infowindow = new kakao.maps.InfoWindow({
    content: content,
    zIndex: 1,
  });

  // 이전에 열려있던 정보창이 있다면 닫기
  if (currentInfoWindow) {
    currentInfoWindow.close();
  }

  // 새로운 정보창 열기
  infowindow.open(map, selectedMarker);
  // 현재 열린 정보창 저장
  currentInfoWindow = infowindow;

  // 선택된 장소의 리스트 아이템 강조
  const listItems = document.querySelectorAll(".search-result-box li");
  listItems.forEach((item) => {
    item.classList.remove("selected");
    if (item.querySelector(".main-txt").textContent === place.place_name) {
      item.classList.add("selected");
    }
  });
}

// 이벤트 리스너 등록
function attachEventListeners() {
  // 검색 버튼 이벤트 리스너
  const searchButton = document.querySelector(".comp-buttons button");
  if (searchButton) {
    searchButton.addEventListener("click", searchPlaces);
  }

  // 검색창 엔터키 이벤트
  const searchInput = document.getElementById("searchPlace");
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") searchPlaces();
    });
  }

  // 검색 결과 클릭 이벤트
  const searchResultBox = document.querySelector(".search-result-box");
  if (searchResultBox) {
    searchResultBox.addEventListener("click", (e) => {
      const listItem = e.target.closest("li");
      if (listItem) {
        locationModalOpen();
      }
    });
  }

  // 지역 선택 시 지도 이동
  const regionSelect = document.getElementById("region");
  if (regionSelect) {
    regionSelect.addEventListener("change", function () {
      const selectedRegion = this.value;
      if (REGION_COORDS[selectedRegion]) {
        map.setCenter(REGION_COORDS[selectedRegion]);
        map.setLevel(8);
      }
    });
  }
}

// 초기화 함수
function initializeMap() {
  initMap();
  setupMapDragEvent(); // 드래그 이벤트 설정 추가
  attachEventListeners();
  setDefaultDate(); // 날짜 기본값 설정 추가
}

// 날짜 기본값 설정 함수
function setDefaultDate() {
  const dateInput = document.getElementById("text3");
  if (dateInput) {
    // 오늘 날짜를 YYYY-MM-DD 형식으로 변환
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    // 날짜 입력 필드에 기본값 설정
    dateInput.value = formattedDate;
  }
}
