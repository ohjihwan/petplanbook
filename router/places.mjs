// router/places.mjs
import express from "express";
import db from "../data/db.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM places ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("장소 불러오기 실패:", err);
    res.status(500).json({ error: "서버 오류" });
  }
});

export default router;
