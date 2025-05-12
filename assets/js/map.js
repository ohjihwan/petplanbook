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
let selectedPlace = null;
let isMapInitialized = false;
let initAttempts = 0;
const MAX_INIT_ATTEMPTS = 5;

// 카테고리 설정
const CATEGORY_CONFIG = {
	AD5: { name: "숙소", keyword: "애견동반숙소", color: "#FF6B6B" },
	FD6: { name: "식당", keyword: "애견동반식당", color: "#4ECDC4" },
	CE7: { name: "카페", keyword: "애견동반카페", color: "#45B7D1" },
	AT4: { name: "명소", keyword: "애견동반명소", color: "#96CEB4" },
};

// 지역별 중심 좌표 정의
const REGION_COORDS = {
	'서울특별시': { lat: 37.566826, lng: 126.978656 },
	'부산광역시': { lat: 35.1796, lng: 129.0756 },
	'대구광역시': { lat: 35.8714, lng: 128.6014 },
	'인천광역시': { lat: 37.4563, lng: 126.7052 },
	'광주광역시': { lat: 35.1595, lng: 126.8526 },
	'대전광역시': { lat: 36.3504, lng: 127.3845 },
	'울산광역시': { lat: 35.5384, lng: 129.3114 },
	'세종특별자치시': { lat: 36.48, lng: 127.2891 },
	'경기도': { lat: 37.4138, lng: 127.5183 },
	'강원특별자치도': { lat: 37.8228, lng: 128.1555 },
	'충청북도': { lat: 36.6372, lng: 127.489 },
	'충청남도': { lat: 36.5184, lng: 126.8 },
	'전라북도': { lat: 35.7175, lng: 127.153 },
	'전라남도': { lat: 34.8679, lng: 126.991 },
	'경상북도': { lat: 36.4919, lng: 128.8889 },
	'경상남도': { lat: 35.4606, lng: 128.2132 },
	'제주특별자치도': { lat: 33.2539, lng: 126.5596 }
};

// SDK 로드 확인 함수
function checkSDKLoaded() {
    return new Promise((resolve, reject) => {
        if (typeof kakao !== 'undefined' && typeof kakao.maps !== 'undefined') {
            resolve();
        } else {
            reject(new Error('카카오맵 SDK가 로드되지 않았습니다.'));
        }
    });
}

// 카카오맵 초기화 및 설정
window.mapSeting = function() {
    console.log('mapSeting 함수 실행');
    
    try {
        // 지도 생성
        const container = document.getElementById('map');
        if (!container) {
            throw new Error('지도 컨테이너를 찾을 수 없습니다.');
        }

        // 지도 컨테이너 스타일 설정
        container.style.width = '100%';
        container.style.height = '500px';
        container.style.position = 'relative';
        container.style.overflow = 'hidden';
        container.style.display = 'block';
        container.style.visibility = 'visible';
        container.style.minHeight = '500px';
        container.style.zIndex = '1';
        container.style.backgroundColor = '#f8f8f8';

        // 지도 옵션 설정
        const options = {
            center: new kakao.maps.LatLng(37.566826, 126.978656), // 서울시청 좌표
            level: 3 // 지도의 확대 레벨
        };

        // 지도 생성
        map = new kakao.maps.Map(container, options);
        console.log('지도 객체 생성 완료');

        // 지도 로드 완료 이벤트
        kakao.maps.event.addListener(map, 'tilesloaded', function() {
            console.log('지도 타일 로드 완료');
            container.style.display = 'block';
            container.style.visibility = 'visible';
        });

        // 스크롤 이벤트
        window.addEventListener("scroll", function() {
            if (map) {
                map.relayout();
            }
        });

        // 리사이즈 이벤트
        window.addEventListener('resize', function() {
            if (map) {
                map.relayout();
            }
        });

        console.log('지도 초기화 완료');
    } catch (error) {
        console.error('지도 초기화 중 오류 발생:', error);
    }
};

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOMContentLoaded 이벤트 발생");
    
    // SDK 로드 확인 및 초기화
    try {
        await checkSDKLoaded();
        const mapContainer = document.getElementById("map");
        if (mapContainer) {
            console.log("지도 컨테이너를 찾았습니다.");
            window.mapSeting();
        } else {
            console.error("지도 컨테이너를 찾을 수 없습니다.");
        }
    } catch (error) {
        console.error("SDK 로드 실패:", error);
        // SDK 로드 실패 시 재시도
        setTimeout(() => {
            window.mapSeting();
        }, 1000);
    }
});

// 최적화된 경로 계산 함수
function calculateOptimalRoute(places) {
    if (!places || places.length < 2) return places;

    // 시작점을 첫 번째 장소로 설정
    const start = places[0];
    const remaining = places.slice(1);
    const route = [start];

    while (remaining.length > 0) {
        let minDistance = Infinity;
        let nextIndex = 0;

        // 현재 위치에서 가장 가까운 다음 장소 찾기
        for (let i = 0; i < remaining.length; i++) {
            const distance = calculateDistance(
                route[route.length - 1].mapy,
                route[route.length - 1].mapx,
                remaining[i].mapy,
                remaining[i].mapx
            );
            if (distance < minDistance) {
                minDistance = distance;
                nextIndex = i;
            }
        }

        // 가장 가까운 장소를 경로에 추가
        route.push(remaining[nextIndex]);
        remaining.splice(nextIndex, 1);
    }

    return route;
}

// 두 지점 간의 거리 계산 (Haversine 공식)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // 지구의 반경 (km)
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function toRad(value) {
    return value * Math.PI / 180;
}

// 경로 표시 함수 수정
function displayRoute(places) {
    // 기존 경로 제거
    if (polyline) {
        polyline.setMap(null);
    }
    if (routeMarkers.length > 0) {
        routeMarkers.forEach(marker => marker.setMap(null));
        routeMarkers = [];
    }

    if (!places || places.length < 2) return;

    // 최적화된 경로 계산
    const optimizedRoute = calculateOptimalRoute(places);
    
    // 경로 좌표 생성
    const path = optimizedRoute.map(place => 
        new kakao.maps.LatLng(place.mapy, place.mapx)
    );

    // 경로 선 생성
    polyline = new kakao.maps.Polyline({
        path: path,
        strokeWeight: 5,
        strokeColor: '#FF0000',
        strokeOpacity: 0.7,
        strokeStyle: 'solid'
    });

    // 경로 선 표시
    polyline.setMap(map);

    // 경로상의 마커 생성
    optimizedRoute.forEach((place, index) => {
        const marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(place.mapy, place.mapx),
            map: map,
            title: `${index + 1}. ${place.title}`
        });

        // 마커에 순서 표시
        const content = `
            <div style="padding:5px;font-size:12px;background-color:white;border-radius:3px;">
                <strong>${index + 1}. ${place.title}</strong>
            </div>
        `;
        const infowindow = new kakao.maps.InfoWindow({
            content: content,
            zIndex: 1
        });

        kakao.maps.event.addListener(marker, 'click', function() {
            if (currentInfoWindow) {
                currentInfoWindow.close();
            }
            infowindow.open(map, marker);
            currentInfoWindow = infowindow;
        });

        routeMarkers.push(marker);
    });

    // 지도 영역 조정
    const bounds = new kakao.maps.LatLngBounds();
    path.forEach(latlng => bounds.extend(latlng));
    map.setBounds(bounds);
}

// 리스트 순서 업데이트 함수
function updateRouteList(places) {
    const routeList = document.querySelector('.make-route');
    if (!routeList) return;

    // 기존 아이템 제거
    const items = routeList.querySelectorAll('.item:not(.-placeholder)');
    items.forEach(item => item.remove());

    // 새로운 순서로 아이템 추가
    places.forEach((place, index) => {
        const routeItem = document.createElement('div');
        routeItem.className = 'item';
        routeItem.setAttribute('data-mapx', place.mapx);
        routeItem.setAttribute('data-mapy', place.mapy);
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
    });

    // 정렬 기능 재초기화
    initSortable();
}

// 루트에 장소 추가 함수 수정
function addToRoute(place) {
    const routeList = document.querySelector('.make-route');
    const placeholder = routeList.querySelector('.item.-placeholder');
    
    if (placeholder) {
        placeholder.remove();
    }

    // 현재 루트의 모든 장소 수집
    const currentPlaces = Array.from(routeList.querySelectorAll('.item:not(.-placeholder)')).map(item => {
        const name = item.querySelector('.name').textContent;
        const addr1 = item.querySelector('.info dd:nth-child(2)').textContent;
        const tel = item.querySelector('.info dd:nth-child(4)').textContent;
        const mapx = item.getAttribute('data-mapx');
        const mapy = item.getAttribute('data-mapy');
        return { 
            title: name, 
            addr1, 
            tel,
            mapx: parseFloat(mapx),
            mapy: parseFloat(mapy)
        };
    });

    // 새 장소 추가
    currentPlaces.push({
        title: place.title,
        addr1: place.addr1,
        tel: place.tel,
        mapx: parseFloat(place.mapx),
        mapy: parseFloat(place.mapy),
        firstimage: place.firstimage
    });

    // 경로 표시
    displayRoute(currentPlaces);
}

// 정렬 기능 초기화 함수 수정
function initSortable() {
    $('.make-route').sortable({
        handle: '.sorting-handler',
        placeholder: 'item -placeholder',
        forcePlaceholderSize: true,
        update: function(event, ui) {
            // 정렬 후 경로 업데이트
            const places = Array.from(this.querySelectorAll('.item:not(.-placeholder)')).map(item => {
                const name = item.querySelector('.name').textContent;
                const addr1 = item.querySelector('.info dd:nth-child(2)').textContent;
                const tel = item.querySelector('.info dd:nth-child(4)').textContent;
                const mapx = item.getAttribute('data-mapx');
                const mapy = item.getAttribute('data-mapy');
                return { title: name, addr1, tel, mapx: parseFloat(mapx), mapy: parseFloat(mapy) };
            });
            displayRoute(places);
        }
    });
}

// 검색 결과 표시 함수
function displaySearchResults(results) {
    if (!results || results.length === 0) return;
    
    // 검색된 장소들의 경계를 저장할 객체
    const bounds = new kakao.maps.LatLngBounds();
    
    // 각 장소에 대해 마커 생성
    results.forEach(result => {
        const position = new kakao.maps.LatLng(result.y, result.x);
        const marker = new kakao.maps.Marker({
            position: position,
            title: result.place_name
        });

        // 인포윈도우 생성
        const infowindow = new kakao.maps.InfoWindow({
            content: `
                <div style="padding:10px;font-size:14px;width:250px;">
                    <strong style="display:block;margin-bottom:5px;">${result.place_name}</strong>
                    <span style="color:#666;">${result.address_name || '주소 정보 없음'}</span>
                </div>
            `,
            removable: true
        });

        // 마커 클릭 이벤트
        kakao.maps.event.addListener(marker, 'click', function() {
            if (currentInfoWindow) {
                currentInfoWindow.close();
            }
            infowindow.open(map, marker);
            currentInfoWindow = infowindow;
        });

        // 마커를 지도에 표시
        marker.setMap(map);
        markers.push(marker);

        // 경계에 위치 추가
        bounds.extend(position);
    });

    // 검색된 장소들의 경계로 지도 이동
    if (markers.length > 0) {
        map.setBounds(bounds);
    }
}

// 지도 범위 내의 장소만 필터링하는 함수
function filterPlacesInBounds(places) {
    if (!map || !places || places.length === 0) return [];
    
    const bounds = map.getBounds();
    return places.filter(place => {
        if (!place.mapx || !place.mapy) return false;
        const position = new kakao.maps.LatLng(place.mapy, place.mapx);
        return bounds.contain(position);
    });
}

// 마커 표시 함수 수정
window.displayMarkers = function(places) {
    if (!map) {
        console.error('지도가 초기화되지 않았습니다.');
        return;
    }

    console.log('displayMarkers 호출됨, 장소 수:', places?.length);

    // 기존 마커 제거
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    if (!places || places.length === 0) {
        console.log('표시할 장소가 없습니다.');
        return;
    }

    // 검색된 장소들의 경계를 저장할 객체
    const markersBounds = new kakao.maps.LatLngBounds();
    let validMarkerCount = 0;

    // 각 장소에 대해 마커 생성
    places.forEach(place => {
        if (!place.mapx || !place.mapy) {
            console.log('좌표가 없는 장소:', place.title);
            return;
        }

        // 좌표 문자열을 숫자로 변환
        const lat = parseFloat(place.mapy);
        const lng = parseFloat(place.mapx);

        if (isNaN(lat) || isNaN(lng)) {
            console.log('잘못된 좌표 형식:', place.title, { lat, lng });
            return;
        }

        const position = new kakao.maps.LatLng(lat, lng);
        
        console.log('마커 생성:', {
            제목: place.title,
            좌표: { lat, lng }
        });

        // 마커 생성 및 지도에 표시
        const marker = new kakao.maps.Marker({
            position: position,
            map: map,
            title: place.title
        });

        // 인포윈도우 생성
        const infowindow = new kakao.maps.InfoWindow({
            content: `
                <div style="padding:10px;font-size:14px;width:250px;">
                    <strong style="display:block;margin-bottom:5px;">${place.title}</strong>
                    <span style="color:#666;">${place.addr1 || '주소 정보 없음'}</span>
                    <div style="margin-top:5px;">
                        <span style="color:#ff6b6b;">${getCategory(place)}</span>
                    </div>
                </div>
            `,
            removable: true
        });

        // 마커 클릭 이벤트
        kakao.maps.event.addListener(marker, 'click', function() {
            if (currentInfoWindow) {
                currentInfoWindow.close();
            }
            infowindow.open(map, marker);
            currentInfoWindow = infowindow;
            
            // 해당 장소의 상세 정보 모달 열기
            if (typeof openDetailModal === 'function') {
                openDetailModal(place);
            }
        });

        markers.push(marker);
        validMarkerCount++;
        markersBounds.extend(position);
    });

    if (validMarkerCount > 0) {
        console.log('마커 표시 완료:', validMarkerCount, '개의 마커가 표시됨');
        map.relayout();
    } else {
        console.log('표시할 마커가 없습니다.');
    }
};

// 지도 이동 시 해당 지역 검색 함수
window.searchRegionOnMapMove = function() {
    if (!map) return;

    const bounds = map.getBounds();
    const swLatLng = bounds.getSouthWest();
    const neLatLng = bounds.getNorthEast();
    
    // 현재 지도 영역의 중심점 좌표
    const center = map.getCenter();
    
    // 가장 가까운 지역 찾기
    let closestRegion = null;
    let minDistance = Infinity;
    
    for (const [region, coords] of Object.entries(REGION_COORDS)) {
        const regionLatLng = new kakao.maps.LatLng(coords.lat, coords.lng);
        const distance = calculateDistance(
            center.getLat(),
            center.getLng(),
            coords.lat,
            coords.lng
        );
        
        if (distance < minDistance) {
            minDistance = distance;
            closestRegion = region;
        }
    }
    
    if (closestRegion) {
        // 지역 선택 드롭다운 업데이트
        const regionSelect = document.getElementById('region');
        if (regionSelect && regionSelect.value !== closestRegion) {
            regionSelect.value = closestRegion;
            // 검색 실행
            if (typeof window.searchTravelList === 'function') {
                window.searchTravelList();
            }
        }
    }
};

// 지역 선택 시 지도 이동 함수 수정
window.moveToRegion = function(regionName) {
    if (!map) {
        console.error('지도가 초기화되지 않았습니다.');
        return;
    }

    const coords = REGION_COORDS[regionName];
    if (!coords) {
        console.error('해당 지역의 좌표를 찾을 수 없습니다:', regionName);
        return;
    }

    console.log('지역 이동:', regionName, coords);

    // 해당 지역의 중심 좌표로 지도 이동
    const moveLatLng = new kakao.maps.LatLng(coords.lat, coords.lng);
    map.setCenter(moveLatLng);
    map.setLevel(7); // 적절한 줌 레벨로 설정

    // 지도 이동 완료 후 마커 표시
    if (typeof window.filteredData !== 'undefined' && window.filteredData) {
        console.log('지역 이동 후 마커 표시:', window.filteredData.length);
        window.displayMarkers(window.filteredData);
    }
};

// 지도 이동 이벤트 리스너 추가
let isMapEventsInitialized = false;

window.addEventListener('load', function() {
    if (map && !isMapEventsInitialized) {
        // 지도 이동 완료 후 이벤트
        kakao.maps.event.addListener(map, 'dragend', function() {
            // 현재 지도 영역 내의 장소만 표시
            if (typeof window.filteredData !== 'undefined' && window.filteredData) {
                window.displayMarkers(window.filteredData);
            }
        });
        
        // 지도 줌 레벨 변경 완료 후 이벤트
        kakao.maps.event.addListener(map, 'zoom_changed', function() {
            // 현재 지도 영역 내의 장소만 표시
            if (typeof window.filteredData !== 'undefined' && window.filteredData) {
                window.displayMarkers(window.filteredData);
            }
        });

        isMapEventsInitialized = true;
    }
}); 