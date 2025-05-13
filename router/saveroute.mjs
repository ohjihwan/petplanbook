import express from "express";
import db from "../data/db.mjs";

const router = express.Router();

router.post("/save-route", async (req, res) => {
	const { title, addr1, tel, category, firstimage } = req.body;

	try {
		await db.query(
			"INSERT INTO saved_route (title, addr1, tel, category, firstimage) VALUES (?, ?, ?, ?, ?)",
			[title, addr1, tel, category, firstimage]
		);
		res.json({ success: true });
	} catch (err) {
		console.error("❌ 저장 실패:", err.message);
		res.status(500).json({ success: false });
	}
});

router.get("/saved-routes", async (req, res) => {
	try {
		const [rows] = await db.query("SELECT * FROM saved_route ORDER BY created_at DESC");
		res.json({ success: true, data: rows });
	} catch (err) {
		console.error("❌ 불러오기 실패:", err.message);
		res.status(500).json({ success: false });
	}
});

export default router;
