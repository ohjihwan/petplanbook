// router/post.mjs
import express from "express";
import db from "../data/db.mjs";

const router = express.Router();

// 글만 저장하는 API (단일 게시물 저장용)
router.post("/place", async (req, res) => {
  try {
    const { name, description, imageUrl } = req.body;

    if (!name || !description || !imageUrl) {
      return res.status(400).json({ success: false, message: "모든 필드를 입력해주세요." });
    }

    const [result] = await db.query(
      "INSERT INTO post (name, description, image_url) VALUES (?, ?, ?)",
      [name, description, imageUrl]
    );

    res.status(201).json({ success: true, message: "게시물이 성공적으로 등록되었습니다." });
  } catch (error) {
    console.error("게시물 등록 실패:", error);
    res.status(500).json({ success: false, message: "서버 오류가 발생했습니다." });
  }
});

// 글 + 추천 루트 + 날짜 저장 API
router.post("/save-route-post", async (req, res) => {
  const { name, description, imageUrl, savedRoutes, date } = req.body;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // 1. 게시글 저장 (date 포함)
    const [postResult] = await conn.query(
      `INSERT INTO post (name, description, image_url, date)
       VALUES (?, ?, ?, ?)`,
      [name, description, imageUrl, date]
    );
    const postId = postResult.insertId;

    // 2. 추천 루트 리스트 저장 (루트마다 개별 date 포함)
    for (const route of savedRoutes) {
      await conn.query(
        `INSERT INTO post_route (post_id, title, addr1, tel, category, firstimage, date)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          postId,
          route.title,
          route.addr1,
          route.tel,
          route.category,
          route.firstimage,
          route.date, // ← 각 루트의 날짜
        ]
      );
    }

    await conn.commit();
    res.json({ success: true });
  } catch (err) {
    await conn.rollback();
    console.error("❌ 저장 실패:", err.message);
    res.status(500).json({ success: false });
  } finally {
    conn.release();
  }
});

export default router;
