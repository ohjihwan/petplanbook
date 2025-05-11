let travelData = [];
let filteredData = [];
let currentPage = 1;
const itemsPerPage = 8;

// 검색 결과를 전역으로 공유하기 위한 이벤트
const searchResultEvent = new CustomEvent('searchResultUpdated', {
	detail: { data: null }
});

/* function toggleSelect() {
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
} */

async function fetchTravelList() {
	const searchText = document.getElementById("text1")?.value.trim() || "";
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

document.getElementById("text1").addEventListener("keydown", (e) => {
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

function filterAndDisplayList() {
	const searchInput = document.getElementById("text1");
	const regionSelect = document.getElementById("region");
	const categoryCheckboxes = document.querySelectorAll(".checkbox input:checked");

	// DOM 요소가 없을 경우 기본값 사용
	const searchText = searchInput ? searchInput.value.trim().toLowerCase() : "";
	const region = regionSelect ? regionSelect.value : "";
	const selectedCategories = Array.from(categoryCheckboxes).map(checkbox => checkbox.value);

	filteredData = travelData.filter(item => {
		const matchesText = item.title.toLowerCase().includes(searchText);
		const matchesRegion = region === "" || (item.addr1 && item.addr1.includes(region));
		const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(getCategory(item).replace(/[^가-힣]/g, ""));
		return matchesText && matchesRegion && matchesCategory;
	});

	// 검색 결과 이벤트 발생
	searchResultEvent.detail.data = filteredData;
	document.dispatchEvent(searchResultEvent);

	displayTravelList();
}

function displayTravelList() {
	const list = document.getElementById("travel-list");
	if (!list) return;

	const ul = list.querySelector("ul");
	if (!ul) return;

	ul.innerHTML = "";

	const start = 0;
	const end = currentPage * itemsPerPage;
	const displayItems = filteredData.slice(start, end);

	displayItems.forEach(item => {
		const li = document.createElement("li");
		const defaultImage = "https://dummyimage.com/200x200/cccccc/ffffff&text=No+Image";
		const imageUrl = item.firstimage || defaultImage;
		li.innerHTML = `
			<a href="javascript:void(0)" role="button">
				<div class="img-box">
					<div class="category ${getCategoryClass(item)}">${getCategory(item)}</div>
					<img src="${imageUrl}" data-src="${imageUrl}" alt="${item.title}" onerror="this.onerror=null; this.src='${imageUrl}';">
				</div>
				<div class="txts">
					<strong class="main-txt">${item.title}</strong>
					<span class="sub-txt">${item.addr1 || '주소 정보 없음'}</span>
				</div>
			</a>
		`;

		// 이미지 로드 시도
		const img = li.querySelector("img");
		if (img) {
			img.onload = function() {
				if (this.src !== defaultImage) {
					this.src = this.getAttribute("data-src");
				}
			};
			img.onerror = function() {
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
/* function loadMore() {
	currentPage++;
	displayTravelList();
} */

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