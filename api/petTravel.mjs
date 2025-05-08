// api/petTravel.mjs
import express from "express";
import fetch from "node-fetch";
const router = express.Router();

// API URL 및 인증키 (환경 변수에서 로드)
const API_URL = "https://apis.data.go.kr/B551011/KorPetTourService/detailImage";
const SERVICE_KEY = process.env.API_SERVICE_KEY || "GTr1cI7Wi0FRbOTFBaUzUCzCDP4OnyyEmHnn11pxCUC5ehG5bQnbyztgeydnOWz1O04tjw1SE5RsX8RNo6XCgQ==";

// API 라우터 엔드포인트
router.get("/", async (req, res) => {
    const { contentId = '2654766', pageNo = 1, numOfRows = 10 } = req.query;

    try {
        const response = await fetch(`${API_URL}?serviceKey=${SERVICE_KEY}&numOfRows=${numOfRows}&pageNo=${pageNo}&MobileOS=ETC&MobileApp=AppTest&contentId=${contentId}&imageYN=Y&_type=json`);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error("API 요청 에러:", error);
        res.status(500).json({ error: "API 요청 중 에러 발생" });
    }
});

export default router;
