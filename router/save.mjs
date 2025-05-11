import express from "express";
import db from "../data/db.mjs"; // DB 연결 모듈 (경로에 맞게 조정)

const router = express.Router();

router.post("/api/save-place", async (req, res) => {
  const { title, addr1, tel, category } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO places (title, addr1, tel, category) VALUES (?, ?, ?, ?)",
      [title, addr1, tel, category]
    );
    res.json({ success: true, message: "장소 저장 완료", id: result.insertId });
  } catch (error) {
    console.error("DB 저장 실패:", error);
    res
      .status(500)
      .json({ success: false, message: "DB 저장 실패", error: error.message });
  }
});

router.delete("/save-places/:id", async (req, res) => {
	const placeId = req.params.id;
	try {
		await db.query(
			"DELETE FROM saved_places WHERE id = ?",
			[placeId]
		);
		res.json({ success: true, message: "삭제 성공" });
	} catch (err) {
		console.error("DB 삭제 오류:", err);
		res.status(500).json({ success: false, message: "삭제 실패" });
	}
});

export default router;
