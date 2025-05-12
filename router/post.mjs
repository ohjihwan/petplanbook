// router/post.mjs
import express from "express";
import db from "../data/db.mjs";

const router = express.Router();

// 게시물 저장 API
router.post("/place", async (req, res) => {
  try {
    const { name, description, imageUrl } = req.body;

    if (!name || !description || !imageUrl) {
      return res.status(400).json({ success: false, message: "모든 필드를 입력해주세요." });
    }

    const [result] = await db.query(
      "INSERT INTO post (title, content, image_url) VALUES (?, ?, ?)",
      [name, description, imageUrl]
    );

    res.status(201).json({ success: true, message: "게시물이 성공적으로 등록되었습니다." });
  } catch (error) {
    console.error("게시물 등록 실패:", error);
    res.status(500).json({ success: false, message: "서버 오류가 발생했습니다." });
  }
});

export default router;
