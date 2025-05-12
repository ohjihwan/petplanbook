import express from "express";
import db from "../data/db.mjs";

const router = express.Router();

router.post("/save-place", async (req, res) => {
  const { title, addr1, tel, category, firstimage } = req.body; // ✅ firstimage 추가

  try {
    const [result] = await db.query(
      "INSERT INTO saved_place (title, addr1, tel, category, firstimage) VALUES (?, ?, ?, ?, ?)",
      [title, addr1, tel, category, firstimage] // ✅ firstimage 값도 전달
    );
    res.json({ success: true, message: "장소 저장 완료", id: result.insertId });
  } catch (error) {
    console.error("❌ DB 저장 실패:", error.sqlMessage || error.message);
    res.status(500).json({ success: false, message: "DB 저장 실패", error: error.message });
  }
});

export default router;

