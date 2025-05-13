// api/pet_travel.mjs
import express from "express";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const API_LIST_URL = "https://apis.data.go.kr/B551011/KorPetTourService/areaBasedList";
const SERVICE_KEY = process.env.API_SERVICE_KEY;

// 전체 여행지 목록 API (브라우저 직접 요청)
router.get("/list", (req, res) => {
	const { pageNo = 1, numOfRows = 10 } = req.query;

	const listQuery = new URLSearchParams({
		serviceKey: SERVICE_KEY,
		numOfRows,
		pageNo,
		MobileOS: "ETC",
		MobileApp: "AppTest",
		_type: "json"
	}).toString();

	const listUrl = `${API_LIST_URL}?${listQuery}`;
	console.log("📡 여행지 목록 요청 (브라우저 직접):", listUrl);

	// 브라우저에서 직접 요청할 수 있도록 URL만 전달
	res.status(200).json({ url: listUrl });
});

export default router;
