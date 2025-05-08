// api/petTravel.mjs
import express from 'express';
import fetch from 'node-fetch'; // node-fetch 설치 필요
const router = express.Router();

// 공공데이터 API 정보
const API_URL = 'https://apis.data.go.kr/B551011/KorPetTourService/detailImage';
const SERVICE_KEY = 'GTr1cI7Wi0FRbOTFBaUzUCzCDP4OnyyEmHnn11pxCUC5ehG5bQnbyztgeydnOWz1O04tjw1SE5RsX8RNo6XCgQ==';

// 반려동물 여행 API 호출 엔드포인트
router.get('/pet-travel', async (req, res) => {
	const { contentId = '2654766', pageNo = 1, numOfRows = 10 } = req.query;

	try {
		const response = await fetch(`${API_URL}?serviceKey=${SERVICE_KEY}&numOfRows=${numOfRows}&pageNo=${pageNo}&MobileOS=ETC&MobileApp=AppTest&contentId=${contentId}&imageYN=Y&_type=json`);
		const data = await response.json();
		res.status(200).json(data);
	} catch (error) {
		console.error('API 요청 에러:', error);
		res.status(500).json({ error: 'API 요청 중 에러 발생' });
	}
});

export default router;
