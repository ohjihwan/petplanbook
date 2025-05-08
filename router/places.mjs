import express from "express";
import multer from "multer";
import db from "../data/db.mjs";
import path from "path";


const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// CREATE
router.post("/places", upload.single("image"), async (req, res) => {
  const { name, category, address, description } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  if (!name || !category || !address || !description) {
    return res.status(400).send("필수 항목이 누락되었습니다.");
  }

  try {
    const [result] = await db.query(
      "INSERT INTO places (name, category, address, description, image_url) VALUES (?, ?, ?, ?, ?)",
      [name, category, address, description, imageUrl]
    );
    res
      .status(201)
      .json({ message: "장소 등록 완료", placeId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).send("서버 오류");
  }
});

// READ all
router.get("/places", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM places ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("서버 오류");
  }
});

// READ single
router.get("/places/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM places WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).send("장소를 찾을 수 없습니다.");
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("서버 오류");
  }
});

// UPDATE
router.put("/places/:id", async (req, res) => {
  const { id } = req.params;
  const { name, category, address, description } = req.body;

  try {
    await db.query(
      "UPDATE places SET name = ?, category = ?, address = ?, description = ? WHERE id = ?",
      [name, category, address, description, id]
    );
    res.json({ message: "장소 수정 완료" });
  } catch (err) {
    console.error(err);
    res.status(500).send("서버 오류");
  }
});

// DELETE
router.delete("/places/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM places WHERE id = ?", [id]);
    res.json({ message: "장소 삭제 완료" });
  } catch (err) {
    console.error(err);
    res.status(500).send("서버 오류");
  }
});

router.post("/places", upload.single("image"), async (req, res) => {
  const { name, category, address, description } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  console.log("받은 값:", {
    name,
    category,
    address,
    description,
    imageUrl,
  });

  if (!name || !category || !address || !description) {
    console.log("필수 항목 누락됨");
    return res.status(400).send("필수 항목이 누락되었습니다.");
  }

  try {
    const [result] = await db.query(
      "INSERT INTO places (name, category, address, description, image_url) VALUES (?, ?, ?, ?, ?)",
      [name, category, address, description, imageUrl]
    );
    res
      .status(201)
      .json({ message: "장소 등록 완료", placeId: result.insertId });
  } catch (err) {
    console.error("INSERT 실패:", err);
    res.status(500).send("서버 오류");
  }
});

// 개별 장소 조회
router.get("/places/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM places WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).send("존재하지 않는 장소");
    res.json(rows[0]);
  } catch (err) {
    console.error("개별 장소 조회 실패:", err);
    res.status(500).send("서버 오류");
  }
});

export default router;
