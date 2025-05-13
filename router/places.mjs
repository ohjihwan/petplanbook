import express from "express";
import db from "../data/db.mjs";

const router = express.Router();

router.delete("/places/delete", async (req, res) => {
	try {
		const { title } = req.body;
		if (!title) return res.status(400).json({ error: "제목이 필요합니다" });

		const [result] = await db.query("DELETE FROM MY022 WHERE title = ?", [title]);

		if (result.affectedRows === 0) {
			return res.status(404).json({ error: "삭제할 데이터가 없습니다" });
		}

		res.status(200).json({ message: "삭제 완료" });
	} catch (err) {
		console.error("삭제 실패:", err);
		res.status(500).json({ error: "서버 오류" });
	}
});

export default router;

