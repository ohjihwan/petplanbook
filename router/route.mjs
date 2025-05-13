import express from "express";
import pool from "../data/db.mjs";
import multer from "multer";

const router = express.Router();

router.post("/api/route", async (req, res) => {
	const { place, address, date_year, date_month, date_day } = req.body;
	try {
		const [result] = await pool.query(
			"INSERT INTO route (place, address, date_year, date_month, date_day) VALUES (?, ?, ?, ?, ?)",
			[place, address, date_year, date_month, date_day]
		);
		res.json({ message: "루트가 성공적으로 저장되었습니다!" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "데이터 저장 중 오류 발생", details: err.message });
	}
});

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/"); // 업로드 폴더
	},
	filename: function (req, file, cb) {
		const ext = path.extname(file.originalname);
		cb(null, Date.now() + ext); // 예: 1685039374590.jpg
	},
});

const upload = multer({ storage: storage });

router.post("/api/post", upload.single("image"), async (req, res) => {
	const { title, content } = req.body;
	const image_url = req.file ? `/uploads/${req.file.filename}` : null;

	try {
		const [result] = await pool.query(
			"INSERT INTO post (title, image_url, content) VALUES (?, ?, ?)",
			[title, image_url, content]
		);
		res.json({ message: "게시글이 저장되었습니다!", postId: result.insertId });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "게시글 저장 중 오류 발생", details: err.message });
	}
});

router.get("/api/routes", async (req, res) => {
	try {
		const [rows] = await pool.query("SELECT * FROM routes ORDER BY id DESC");
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "데이터 불러오기 중 오류 발생", details: err.message });
	}
});

export default router;
