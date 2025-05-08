document.addEventListener("DOMContentLoaded", function () {
  const searchBtn = document.querySelector(".comp-buttons button");
  const resultBox = document.querySelector(".search-result-box ul");

  // 예시 장소 데이터
  // api와 DB 연동이 된다면 지울 것
  const places = [
    {
      name: "무지개 애견 유치원",
      region: "경기도",
      keyword: "애견유치원",
      address: "경기도 평택시 비전동",
      img: "/assets/imgs/temp/temp-list2.jpg",
      badge: "추천",
      badgeClass: "-color3",
    },
    {
      name: "애견가게 스타필드점",
      region: "서울특별시",
      keyword: "애견가게",
      address: "서울시 서초구 방배동",
      img: "/assets/imgs/temp/temp-list2.jpg",
      badge: "인기",
      badgeClass: "-color2",
    },
    {
      name: "별나라 애견동반 호텔",
      region: "서울특별시",
      keyword: "호텔",
      address: "서울시 강남구 역삼동",
      img: "/assets/imgs/temp/temp-list2.jpg",
      badge: "",
      badgeClass: "",
    },
    // 필요한 만큼 추가 가능
  ];

  searchBtn.addEventListener("click", () => {
    const region = document.querySelector("#region").value.trim();
    const keyword = document.querySelector("#searchKeyword").value.trim();
    const date = document.querySelector("#text3").value.trim();
    const people = document.querySelector("#text33").value.trim();
    const pets = document.querySelector("#text44").value.trim();

    // 입력 필터에 따라 필터링
    const filtered = places.filter(
      (place) =>
        (!region || place.region === region) &&
        (!keyword || place.keyword.includes(keyword))
    );

    // 결과 영역 비우고 다시 채우기
    resultBox.innerHTML = "";

    if (filtered.length === 0) {
      resultBox.innerHTML = "<li>검색 결과가 없습니다.</li>";
      return;
    }

    filtered.forEach((place) => {
      const badge = place.badge
        ? `<div class="flags"><span class="flag ${place.badgeClass}">${place.badge}</span></div>`
        : "";

      const html = `
          <li>
            <a href="#none" role="button" onclick="locationModalOpen()">
              <div class="img-box">
                ${badge}
                <img src="${place.img}" alt="${place.name}" />
              </div>
              <div class="txts">
                <strong class="main-txt">${place.name.replace(
                  keyword,
                  `<span class="point">${keyword}</span>`
                )}</strong>
                <span class="sub-txt">${place.address}</span>
              </div>
            </a>
          </li>
        `;
      resultBox.insertAdjacentHTML("beforeend", html);
    });
  });
});
