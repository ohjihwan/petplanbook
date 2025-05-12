let travelData = [];
window.filteredData = [];
let currentPage = 1;
const itemsPerPage = 8;

// 지역명 매핑 객체 추가
const REGION_MAPPING = {
	'서울특별시': ['서울', '서울시', '서울특별시', '서울시특별시'],
	'부산광역시': ['부산', '부산시', '부산광역시'],
	'대구광역시': ['대구', '대구시', '대구광역시'],
	'인천광역시': ['인천', '인천시', '인천광역시'],
	'광주광역시': ['광주', '광주시', '광주광역시'],
	'대전광역시': ['대전', '대전시', '대전광역시'],
	'울산광역시': ['울산', '울산시', '울산광역시'],
	'세종특별자치시': ['세종', '세종시', '세종특별자치시'],
	'경기도': ['경기', '경기도'],
	'강원도': ['강원', '강원도', '강원특별자치도'],
	'강원특별자치도': ['강원', '강원도', '강원특별자치도'],
	'충청북도': ['충북', '충청북도'],
	'충청남도': ['충남', '충청남도'],
	'전라북도': ['전북', '전라북도'],
	'전라남도': ['전남', '전라남도'],
	'경상북도': ['경북', '경상북도'],
	'경상남도': ['경남', '경상남도'],
	'제주특별자치도': ['제주', '제주도', '제주특별자치도']
};

// 지역 코드 매핑
const REGION_CODES = {
	'서울특별시': { 
		areacode: '1',
		sigungucode: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25']
	},
	'부산광역시': { 
		areacode: '6',
		sigungucode: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16']
	},
	'대구광역시': { 
		areacode: '4',
		sigungucode: ['1', '2', '3', '4', '5', '6', '7', '8']
	},
	'인천광역시': { 
		areacode: '2',
		sigungucode: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
	},
	'광주광역시': { 
		areacode: '5',
		sigungucode: ['1', '2', '3', '4', '5']
	},
	'대전광역시': { 
		areacode: '3',
		sigungucode: ['1', '2', '3', '4', '5']
	},
	'울산광역시': { 
		areacode: '7',
		sigungucode: ['1', '2', '3', '4', '5']
	},
	'세종특별자치시': { 
		areacode: '8',
		sigungucode: ['1']
	},
	'경기도': { 
		areacode: '31',
		sigungucode: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
	},
	'강원도': { 
		areacode: '32',
		sigungucode: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18']
	},
	'강원특별자치도': { 
		areacode: '32',
		sigungucode: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18']
	},
	'충청북도': { 
		areacode: '33',
		sigungucode: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13']
	},
	'충청남도': { 
		areacode: '34',
		sigungucode: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15']
	},
	'전라북도': { 
		areacode: '35',
		sigungucode: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14']
	},
	'전라남도': { 
		areacode: '36',
		sigungucode: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22']
	},
	'경상북도': { 
		areacode: '37',
		sigungucode: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
	},
	'경상남도': { 
		areacode: '38',
		sigungucode: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18']
	},
	'제주특별자치도': { 
		areacode: '39',
		sigungucode: ['1', '2', '3', '4', '5']
	}
};

// 검색 결과를 전역으로 공유하기 위한 이벤트
const searchResultEvent = new CustomEvent('searchResult', {
	detail: { results: [] }
});

// 검색 결과 이벤트 리스너
document.addEventListener('searchResult', function(e) {
	if (e.detail.results && typeof window.displayMarkers === 'function') {
		console.log('검색 결과 이벤트 수신:', e.detail.results.length);
		window.displayMarkers(e.detail.results);
	}
});

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
		// 지역 선택 시 해당 지역의 데이터만 필터링
		filterAndDisplayList();
	}
} 

async function fetchTravelList() {
	try {
		const searchText = document.getElementById("text1")?.value.trim() || 
						  document.getElementById("searchPlace")?.value.trim() || "";
		const region = document.getElementById("region")?.value || "";
		
		console.log('검색 조건:', { searchText, region });

		// 지역 코드 가져오기
		const regionCode = region ? REGION_CODES[region] : null;
		
		// API 요청 URL
		let listUrl = `https://apis.data.go.kr/B551011/KorPetTourService/areaBasedList?serviceKey=GTr1cI7Wi0FRbOTFBaUzUCzCDP4OnyyEmHnn11pxCUC5ehG5bQnbyztgeydnOWz1O04tjw1SE5RsX8RNo6XCgQ%3D%3D&numOfRows=1000&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json`;
		
		// 지역이 선택된 경우 지역 코드 추가
		if (regionCode) {
			listUrl += `&areaCode=${regionCode.areacode}`;
			console.log('지역 코드 추가:', regionCode.areacode);
		}

		console.log("📡 API 요청 URL:", listUrl);
		
		const response = await fetch(listUrl);
		const apiData = await response.json();
		
		if (!apiData.response?.body?.items?.item) {
			console.error('API 응답 데이터 형식이 올바르지 않습니다:', apiData);
			return;
		}

		// API 응답 데이터 처리
		travelData = Array.isArray(apiData.response.body.items.item) 
			? apiData.response.body.items.item 
			: [apiData.response.body.items.item];

		console.log('API 응답 데이터:', {
			전체데이터수: travelData.length,
			첫번째항목: travelData[0],
			마지막항목: travelData[travelData.length - 1],
			선택지역: region,
			지역코드: regionCode
		});

		// 검색어가 있는 경우에만 추가 필터링
		if (searchText) {
			filterAndDisplayList(searchText, region);
		} else {
			// 검색어가 없는 경우 전체 데이터 표시
			window.filteredData = travelData;
			displayTravelList();
			
			// 검색 결과 이벤트 발생
			if (window.filteredData && window.filteredData.length > 0) {
				console.log('검색 결과 이벤트 발생:', window.filteredData.length);
				searchResultEvent.detail.results = window.filteredData;
				document.dispatchEvent(searchResultEvent);
			}
		}
	} catch (error) {
		console.error('API 요청 실패:', error);
	}
}

// 검색어 입력 이벤트 리스너
document.getElementById("text1")?.addEventListener("keydown", (e) => {
	if (e.key === "Enter") {
		searchTravelList();
	}
});

function searchTravelList() {
	currentPage = 1;
	travelData = [];
	filteredData = [];
	fetchTravelList();
}

function filterAndDisplayList(searchText = "", region = "") {
	if (!travelData || travelData.length === 0) {
		console.log('필터링할 데이터가 없습니다.');
		return;
	}

	console.log('필터링 시작:', {
		검색어: searchText,
		선택지역: region,
		전체데이터수: travelData.length
	});

	// 선택된 지역의 모든 가능한 이름 가져오기
	let regionNames = [];
	if (region) {
		regionNames = REGION_MAPPING[region] || [region];
		console.log('선택된 지역의 가능한 이름들:', regionNames);
	}

	// 지역 매칭 성공한 데이터 저장
	let matchedItems = [];

	// 데이터 필터링
	window.filteredData = travelData.filter(item => {
		if (!item) {
			console.log('유효하지 않은 아이템:', item);
			return false;
		}

		// 검색어 매칭 (제목과 주소 모두 검색)
		const searchMatch = !searchText || 
			(item.title && item.title.toLowerCase().includes(searchText.toLowerCase())) ||
			(item.addr1 && item.addr1.toLowerCase().includes(searchText.toLowerCase())) ||
			(item.addr2 && item.addr2.toLowerCase().includes(searchText.toLowerCase()));

		// 지역 매칭
		let regionMatch = !region;
		if (region) {
			const regionCode = REGION_CODES[region];
			
			// 지역 코드로 매칭 (문자열 타입으로 통일)
			if (regionCode && String(item.areacode) === String(regionCode.areacode)) {
				regionMatch = true;
				matchedItems.push(item);
				
				// 디버깅을 위한 로그
				console.log('지역 매칭 성공:', {
					항목: item.title,
					주소: item.addr1,
					지역코드: item.areacode,
					선택지역: region,
					예상지역코드: regionCode.areacode,
					좌표: { x: item.mapx, y: item.mapy }
				});
			} else {
				regionMatch = false;
				console.log('지역 불일치:', {
					항목: item.title,
					주소: item.addr1,
					지역코드: item.areacode,
					선택지역: region,
					예상지역코드: regionCode?.areacode,
					타입비교: {
						itemAreacode: typeof item.areacode,
						regionCodeAreacode: typeof regionCode?.areacode
					}
				});
			}
		}

		const isMatch = searchMatch && regionMatch;
		if (isMatch) {
			console.log('매칭된 아이템:', {
				제목: item.title,
				주소: item.addr1,
				지역코드: item.areacode,
				검색어매칭: searchMatch,
				지역매칭: regionMatch
			});
		}

		return isMatch;
	});

	console.log('필터링 결과:', {
		전체데이터수: travelData.length,
		필터링후데이터수: window.filteredData.length,
		첫번째결과: window.filteredData[0],
		마지막결과: window.filteredData[window.filteredData.length - 1],
		지역매칭성공수: matchedItems.length
	});

	// 필터링된 데이터 표시
	displayTravelList();

	// 검색 결과 이벤트 발생
	if (matchedItems.length > 0) {
		console.log('지역 매칭 성공한 장소 표시:', matchedItems.length);
		searchResultEvent.detail.results = matchedItems;
		document.dispatchEvent(searchResultEvent);
	} else {
		console.log('지역 매칭 성공한 장소가 없습니다.');
	}
}

function displayTravelList() {
	const list = document.getElementById("travel-list");
	if (!list) return;

	const ul = list.querySelector("ul");
	if (!ul) return;

	ul.innerHTML = "";

	if (!window.filteredData || window.filteredData.length === 0) {
		ul.innerHTML = "<li>검색 결과가 없습니다.</li>";
		const loadMoreButton = document.getElementById("load-more");
		if (loadMoreButton) {
			loadMoreButton.style.display = "none";
		}
		return;
	}

	const start = 0;
	const end = currentPage * itemsPerPage;
	const displayItems = window.filteredData.slice(start, end);

	displayItems.forEach(item => {
		const li = document.createElement("li");
		const defaultImage = "https://dummyimage.com/200x200/cccccc/ffffff&text=No+Image";
		const imageUrl = item.firstimage || defaultImage;
		li.innerHTML = `
			<a href="javascript:void(0)" role="button">
				<div class="img-box">
					<div class="category ${getCategoryClass(item)}">${getCategory(item)}</div>
					<img src="${imageUrl}" data-src="${imageUrl}" alt="${item.title}" onerror="this.onerror=null; this.src='${defaultImage}';">
				</div>
				<div class="txts">
					<strong class="main-txt">${item.title}</strong>
					<span class="sub-txt">${item.addr1 || '주소 정보 없음'}</span>
				</div>
			</a>
		`;

		li.addEventListener("click", () => openDetailModal(item));
		ul.appendChild(li);
	});

	const loadMoreButton = document.getElementById("load-more");
	if (loadMoreButton) {
		loadMoreButton.style.display = end < window.filteredData.length ? "inline-block" : "none";
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

// ✅ 모달 열기 함수 추가
function openDetailModal(item) {
	const modal = document.getElementById("detail");
	const swiperWrapper = modal.querySelector(".swiper-wrapper");
	swiperWrapper.innerHTML = `
		<div class="swiper-slide">
			<img src="${item.firstimage || "https://dummyimage.com/200x200/cccccc/ffffff&text=No+Image"}" alt="${item.title}">
		</div>
	`;
	const details = modal.querySelectorAll(".details dd");
	details[0].textContent = item.title || "-";
	details[1].textContent = item.addr1 || "-";
	details[2].textContent = item.tel || "-";
	details[3].textContent = getCategory(item) || "-";
	modal.style.display = "block";
	new Swiper(".mySwiper", {
		navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev",
		},
	});
} 