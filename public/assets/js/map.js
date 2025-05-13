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
let isMapInitialized = false;
let initAttempts = 0;
const MAX_INIT_ATTEMPTS = 5;

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
window.mapSeting = async function() {
    console.log('mapSeting 함수 실행');
    
    // 이미 초기화된 경우 중복 실행 방지
    if (isMapInitialized) {
        console.log('지도가 이미 초기화되어 있습니다.');
        return;
    }

    try {
        // SDK 로드 확인
        await checkSDKLoaded();

        // 지도 생성
        const container = document.getElementById('map');
        if (!container) {
            throw new Error('지도 컨테이너를 찾을 수 없습니다.');
        }

        // 지도 컨테이너 스타일 강제 설정
        container.style.cssText = `
            width: 100% !important;
            height: 500px !important;
            position: relative !important;
            overflow: hidden !important;
            display: block !important;
            visibility: visible !important;
            min-height: 500px !important;
            z-index: 1 !important;
            background-color: #f8f8f8 !important;
        `;

        const options = {
            center: new kakao.maps.LatLng(37.566826, 126.978656), // 서울시청 좌표
            level: 3, // 지도의 확대 레벨
            draggable: true,
            scrollwheel: true,
            disableDoubleClickZoom: false,
            keyboardShortcuts: true
        };

        map = new kakao.maps.Map(container, options);
        console.log('지도 객체 생성 완료');

        // 지도 로드 완료 이벤트
        kakao.maps.event.addListener(map, 'tilesloaded', function() {
            console.log('지도 타일 로드 완료');
            container.style.display = 'block';
            container.style.visibility = 'visible';
            isMapInitialized = true;
            initAttempts = 0; // 초기화 성공 시 시도 횟수 리셋
        });

        // 마커 생성
        const marker = new kakao.maps.Marker({
            position: map.getCenter()
        });
        marker.setMap(map);

        // 지도 클릭 이벤트
        kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
            const latlng = mouseEvent.latLng;
            marker.setPosition(latlng);
        });

        // 검색 기능
        const searchInput = document.getElementById('text1');
        const searchButton = document.querySelector('.field-search-button');

        // 검색 기능이 있는 경우에만 이벤트 리스너 추가
        if (searchButton && searchInput) {
            searchButton.addEventListener('click', function() {
                const keyword = searchInput.value;
                if (!keyword) {
                    alert('검색어를 입력해주세요.');
                    return;
                }

                // 장소 검색 객체 생성
                const places = new kakao.maps.services.Places();
                
                // 키워드로 장소 검색
                places.keywordSearch(keyword, function(results, status) {
                    if (status === kakao.maps.services.Status.OK) {
                        // 검색된 장소 위치로 지도 이동
                        const bounds = new kakao.maps.LatLngBounds();
                        
                        results.forEach(function(result) {
                            bounds.extend(new kakao.maps.LatLng(result.y, result.x));
                        });
                        
                        map.setBounds(bounds);
                        marker.setPosition(new kakao.maps.LatLng(results[0].y, results[0].x));
                    } else {
                        alert('검색 결과가 없습니다.');
                    }
                });
            });
        }

        // 이벤트 리스너 설정
        function setupEventListeners() {
            // 스크롤 이벤트
            window.addEventListener("scroll", function() {
                if (map) {
                    map.relayout();
                }
            });

            // 지도 이동 이벤트
            if (map) {
                kakao.maps.event.addListener(map, "bounds_changed", function() {
                    if (typeof filteredData !== 'undefined' && filteredData && filteredData.length > 0) {
                        displaySearchResults(filteredData);
                    }
                });
            }
        }

        // 이벤트 리스너 설정 실행
        setupEventListeners();

        // 추가적인 크기 조정 이벤트
        window.addEventListener('resize', function() {
            if (map) {
                map.relayout();
                container.style.display = 'block';
                container.style.visibility = 'visible';
            }
        });

        // MutationObserver 설정
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && 
                    (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
                    container.style.display = 'block';
                    container.style.visibility = 'visible';
                    if (map) {
                        map.relayout();
                    }
                }
            });
        });

        observer.observe(container, {
            attributes: true,
            attributeFilter: ['style', 'class']
        });

        console.log('지도 초기화 완료');
    } catch (error) {
        console.error('지도 초기화 중 오류 발생:', error);
        isMapInitialized = false;
        
        // 재시도 로직
        if (initAttempts < MAX_INIT_ATTEMPTS) {
            initAttempts++;
            console.log(`지도 초기화 재시도 (${initAttempts}/${MAX_INIT_ATTEMPTS})`);
            setTimeout(() => {
                window.mapSeting();
            }, 1000); // 1초 후 재시도
        } else {
            console.error('최대 초기화 시도 횟수를 초과했습니다.');
        }
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

// 경로 표시 함수
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

    // 리스트 순서 업데이트
    updateRouteList(optimizedRoute);
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