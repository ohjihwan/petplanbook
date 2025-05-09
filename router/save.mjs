import express from "express";
import db from "../data/db.mjs";

const router = express.Router();

router.post("/save-route", async (req, res) => {
	const { title, addr1, tel, category } = req.body;
	try {
		await db.query(
			"INSERT INTO saved_places (title, addr1, tel, category) VALUES (?, ?, ?, ?)",
			[title, addr1, tel, category]
		);
		res.json({ success: true, message: "저장 성공" });
	} catch (err) {
		console.error("DB 오류:", err);
		res.status(500).json({ success: false, message: "저장 실패" });
	}
});

router.get("/places", async (req, res) => {
	try {
		const [rows] = await db.query(
			"SELECT * FROM saved_places ORDER BY created_at DESC"
		);
		res.json(rows);
	} catch (err) {
		console.error("DB 조회 오류:", err);
		res.status(500).json({ success: false, message: "조회 실패" });
	}
});

export default router;
