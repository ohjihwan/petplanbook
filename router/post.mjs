import express from "express";
import multer from "multer";
import pool from "../data/db.mjs";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, "uploads/"),
	filename: (req, file, cb) =>
		cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

router.post("/api/post", upload.single("image"), async (req, res) => {
	const { title, content } = req.body;
	const image_url = req.file ? `/uploads/${req.file.filename}` : null;

	if (!title || !content) {
		return res.status(400).json({ error: "제목과 내용을 입력하세요." });
	}

	try {
		const [result] = await pool.query(
			"INSERT INTO post (title, image_url, content) VALUES (?, ?, ?)",
			[title, image_url, content]
		);
		res.json({ message: "게시글 저장 성공!", postId: result.insertId });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "DB 저장 실패", details: err.message });
	}
});

export default router;
