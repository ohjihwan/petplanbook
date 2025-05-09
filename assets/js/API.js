let travelData = [];
let filteredData = [];
let currentPage = 1;
const itemsPerPage = 8;

async function fetchTravelList() {
	const listUrl = `https://apis.data.go.kr/B551011/KorPetTourService/areaBasedList?serviceKey=GTr1cI7Wi0FRbOTFBaUzUCzCDP4OnyyEmHnn11pxCUC5ehG5bQnbyztgeydnOWz1O04tjw1SE5RsX8RNo6XCgQ%3D%3D&numOfRows=1000&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json`;
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
	travelData = [];
	filteredData = [];
	currentPage = 1;
	fetchTravelList();
}

function filterAndDisplayList() {
	const searchText = document.getElementById("text1").value.trim().toLowerCase();
	const region = document.getElementById("region").value;
	const selectedCategories = Array.from(document.querySelectorAll(".checkbox input:checked")).map(checkbox => checkbox.value);

	filteredData = travelData.filter(item => {
		const matchesText = item.title.toLowerCase().includes(searchText);
		const matchesRegion = region === "" || (item.addr1 && item.addr1.includes(region));
		const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(getCategory(item).replace(/[^가-힣]/g, ""));
		return matchesText && matchesRegion && matchesCategory;
	});

	displayTravelList();
}

function displayTravelList() {
	const list = document.getElementById("travel-list");
	const ul = list.querySelector("ul");
	ul.innerHTML = ""; // 기존 목록 초기화

	const start = (currentPage - 1) * itemsPerPage;
	const end = start + itemsPerPage;
	const displayItems = filteredData.slice(0, end);

	displayItems.forEach(item => {
		const li = document.createElement("li");
		li.innerHTML = `
			<a href="#none" role="button">
				<div class="img-box">
					<div class="category ${getCategoryClass(item)}">${getCategory(item)}</div>
					<img src="${item.firstimage || 'https://dummyimage.com/200x200/cccccc/ffffff&text=No+Image'}" alt="${item.title}">
				</div>
				<div class="txts">
					<strong class="main-txt">${item.title}</strong>
					<span class="sub-txt">${item.addr1 || '주소 정보 없음'}</span>
				</div>
			</a>
		`;
		ul.appendChild(li);
	});

	// "더보기" 버튼 표시/숨김 제어
	const loadMoreButton = document.getElementById("load-more");
	if (displayItems.length >= itemsPerPage && end < filteredData.length) {
		loadMoreButton.style.display = "inline-block";
	} else {
		loadMoreButton.style.display = "none";
	}

	// 노출된 li 수와 전체 필터링 수 콘솔 출력
	console.log(`📊 노출된 아이템 수: ${ul.querySelectorAll("li").length} / ${filteredData.length}`);
}

function loadMore() {
	currentPage++;
	displayTravelList();
}

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