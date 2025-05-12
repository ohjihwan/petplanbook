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

// CREATE - 글 작성
router.post("/posts", upload.single("image"), async (req, res) => {
	const { user_id, title, content } = req.body;
	const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

	if (!user_id || !title || !content) {
		return res.status(400).send("필수 항목이 누락되었습니다.");
	}

	try {
		const [result] = await db.query(
			"INSERT INTO comm_posts (user_id, title, content, image_url) VALUES (?, ?, ?, ?)",
			[user_id, title, content, imageUrl]
		);
		res
			.status(201)
			.json({ message: "게시글 작성 완료", postId: result.insertId });
	} catch (err) {
		console.error(err);
		res.status(500).send("서버 오류");
	}
});

// READ - 전체 목록
router.get("/posts", async (req, res) => {
	try {
		const [rows] = await db.query(
			"SELECT * FROM comm_posts ORDER BY created_at DESC"
		);
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).send("서버 오류");
	}
});

// READ - 개별 상세 조회
router.get("/posts/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const [rows] = await db.query("SELECT * FROM comm_posts WHERE id = ?", [
			id,
		]);
		if (rows.length === 0) {
			return res.status(404).send("게시글을 찾을 수 없습니다.");
		}
		res.json(rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).send("서버 오류");
	}
});

// UPDATE - 글 수정
router.put("/posts/:id", async (req, res) => {
	const { id } = req.params;
	const { title, content } = req.body;

	try {
		await db.query(
			"UPDATE comm_posts SET title = ?, content = ? WHERE id = ?",
			[title, content, id]
		);
		res.json({ message: "게시글 수정 완료" });
	} catch (err) {
		console.error(err);
		res.status(500).send("서버 오류");
	}
});

// DELETE - 글 삭제
router.delete("/posts/:id", async (req, res) => {
	const { id } = req.params;
	try {
		await db.query("DELETE FROM comm_posts WHERE id = ?", [id]);
		res.json({ message: "게시글 삭제 완료" });
	} catch (err) {
		console.error(err);
		res.status(500).send("서버 오류");
	}
});

export default router;
