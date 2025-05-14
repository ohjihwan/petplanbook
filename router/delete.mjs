import express from "express";
import db from "../data/db.mjs"; // DB 커넥션 객체

const router = express.Router();

// 장소 삭제: id 또는 title 기준
router.delete("/delete-place", async (req, res) => {
	try {
		const { id, title } = req.body;

		if (!id && !title) {
			return res.status(400).json({
				success: false,
				message: "삭제하려면 id 또는 title 중 하나가 필요합니다.",
			});
		}

		const query = id
			? "DELETE FROM places WHERE id = ?"
			: "DELETE FROM places WHERE title = ?";
		const param = id || title;

		const [result] = await db.query(query, [param]);

		if (result.affectedRows === 0) {
			return res.status(404).json({
				success: false,
				message: "삭제할 데이터가 존재하지 않습니다.",
			});
		}

		res.json({
			success: true,
			message: "✅ 삭제가 완료되었습니다.",
		});
	} catch (error) {
		console.error("❌ 삭제 실패:", error);
		res.status(500).json({
			success: false,
			message: "서버 오류 발생",
			error: error.message,
		});
	}
});

export default router;
