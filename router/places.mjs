import express from "express";
import db from "../data/db.mjs"; // 데이터베이스 연결 파일 경로에 맞게 조정

const router = express.Router();

// 장소 목록 조회 API
router.get("/api/places", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM places ORDER BY created_at DESC"
    );
    res.json(rows); // 반드시 JSON 형식으로 응답해야 프론트에서 .json()으로 처리 가능
  } catch (error) {
    console.error("DB 조회 실패:", error);
    res.status(500).json({
      success: false,
      message: "DB 조회 중 오류 발생",
      error: error.message,
    });
  }
});

export default router;
