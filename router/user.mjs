import express from "express";
import db from "../data/db.mjs";

const router = express.Router();

// 회원가입 API
router.post("/signup", async (req, res) => {
  try {
    const { email, password, nickname, region, pets, fileName } = req.body;

    // 고양이/강아지 중 하나만 저장 (ENUM 제한)
    const cat_or_dog = pets.includes("고양이")
      ? "cat"
      : pets.includes("강아지")
      ? "dog"
      : null;

    const profile_image_url = fileName ? `/uploads/${fileName}` : null;

    const sql = `
			INSERT INTO user (email, password, nickname, region, cat_or_dog, profile_image_url)
			VALUES (?, ?, ?, ?, ?, ?)
		`;

    await db.execute(sql, [
      email,
      password,
      nickname,
      region,
      cat_or_dog,
      profile_image_url,
    ]);

    res.status(200).json({ success: true, message: "회원가입 완료" });
  } catch (err) {
    console.error("회원가입 실패:", err);
    res.status(500).json({ success: false, message: "회원가입 실패" });
  }
});

// 루트 글 작성 API
router.post("/route-posts", async (req, res) => {
  const { user_id, title, content, place_ids } = req.body;

  if (!user_id || !title || !content || !Array.isArray(place_ids)) {
    return res.status(400).json({ message: "필수 값이 누락되었습니다." });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // 루트 글 저장
    const [result] = await conn.query(
      `INSERT INTO route_post (user_id, title, content) VALUES (?, ?, ?)`,
      [user_id, title, content]
    );
    const postId = result.insertId;

    // 장소 목록 저장
    for (let i = 0; i < place_ids.length; i++) {
      await conn.query(
        `INSERT INTO route_post_place (route_post_id, place_id, order_index) VALUES (?, ?, ?)`,
        [postId, place_ids[i], i]
      );
    }

    await conn.commit();
    res.status(201).json({ message: "루트 글 작성 완료", postId });
  } catch (err) {
    await conn.rollback();
    console.error("루트 글 작성 실패:", err);
    res.status(500).json({ message: "서버 오류" });
  } finally {
    conn.release();
  }
});

// 마이장소 삭제
router.delete("/user/places/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM user_place WHERE id = ?", [id]);
    res.json({ message: "삭제 완료" });
  } catch (err) {
    console.error("삭제 실패:", err);
    res.status(500).send("서버 오류");
  }
});


export default router;
