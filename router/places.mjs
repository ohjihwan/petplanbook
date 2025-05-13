// router/places.mjs
import express from "express";
import db from "../data/db.mjs";

const router = express.Router();

// /api/places 경로 처리
router.get("/places", async (req, res) => {
	try {
		const [rows] = await db.query(
			"SELECT * FROM places ORDER BY created_at DESC"
		);
		res.json({ success: true, data: rows }); // ✅ data 배열로 응답
	} catch (err) {
		console.error("❌ 장소 불러오기 실패:", err);
		res.status(500).json({ success: false, error: "서버 오류", details: err.message });
	}
});

export default router;
