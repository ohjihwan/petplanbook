import express from "express";
import db from "../data/db.mjs";

const router = express.Router();

router.post("/save-place", async (req, res) => {
  const { title, addr1, tel } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO saved_places (title, addr1, tel) VALUES (?, ?, ?)",
      [title, addr1, tel]
    );
    res.json({ success: true, message: "저장 성공!", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "저장 실패" });
  }
});

export default router;
