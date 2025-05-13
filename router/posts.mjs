// router/posts.mjs
import express from "express";
import db from "../data/db.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, name, description, image, author, recommend FROM post ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error("게시글 불러오기 실패:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

export default router;
