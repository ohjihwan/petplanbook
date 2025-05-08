const apiUrl = "https://apis.data.go.kr/B551011/KorPetTourService";
const serviceKey =
  "UvLF7t9J%2FvxTgPxkNgzxlTU%2Blfow7PsCVu0JG9rL%2FCV1eUNnhyXfRPEzBY7l35YwHVA9qO3ziVgCac4nKgpLzg%3D%3D";
const params = "?page=1&perPage=10&serviceKey=" + serviceKey;

fetch(apiUrl + params)
  .then((response) => response.json())
  .then((data) => {
    if (data.data && data.data.length > 0) {
      data.data.forEach((item) => {
        console.log(`장소명: ${item.title}`);
        console.log(`주소: ${item.addr1}`);
        console.log(`이미지: ${item.firstimage}`);
        console.log("---");
      });
    } else {
      console.log("데이터를 불러올 수 없습니다.");
    }
  })
  .catch((error) => {
    console.error("에러 발생:", error);
  });
