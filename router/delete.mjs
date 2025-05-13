// router/delete.mjs
import express from "express";
import db from "../data/db.mjs";

const router = express.Router();

// ✅ ID 또는 title 기준으로 장소 삭제
router.delete("/delete-place", async (req, res) => {
	try {
		const { id, title } = req.body;

		if (!id && !title) {
			return res.status(400).json({ success: false, message: "id 또는 title이 필요합니다." });
		}

		const [result] = await db.query(
			id ? "DELETE FROM places WHERE id = ?" : "DELETE FROM places WHERE title = ?",
			[id || title]
		);

		if (result.affectedRows === 0) {
			return res.status(404).json({ success: false, message: "삭제할 데이터가 없습니다." });
		}

		res.json({ success: true, message: "삭제 완료" });
	} catch (err) {
		console.error("❌ 삭제 실패:", err.message);
		res.status(500).json({ success: false, message: "DB 오류", error: err.message });
	}
});

export default router;
