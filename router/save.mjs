// router/save.mjs
import express from "express";
import db from "../data/db.mjs";

const router = express.Router();

// ✅ 장소 저장 API (POST /api/save-place)
router.post("/save-place", async (req, res) => {
	const { title, addr1, tel, category, firstimage } = req.body;

	try {
		const [result] = await db.query(
			"INSERT INTO places (title, addr1, tel, category, firstimage) VALUES (?, ?, ?, ?, ?)",
			[title, addr1, tel, category, firstimage]
		);
		res.json({ success: true, message: "장소 저장 완료", id: result.insertId });
	} catch (error) {
		console.error("❌ DB 저장 실패:", error.sqlMessage || error.message);
		res.status(500).json({ success: false, message: "DB 저장 실패", error: error.message });
	}
});

// ✅ 장소 목록 조회 API (GET /api/places)
router.get("/places", async (req, res) => {
	try {
		const [rows] = await db.query("SELECT * FROM places ORDER BY created_at DESC");
		res.json({ success: true, data: rows });
	} catch (error) {
		console.error("❌ 장소 불러오기 실패:", error.sqlMessage || error.message);
		res.status(500).json({ success: false, message: "DB 조회 실패", error: error.message });
	}
});

export default router;
