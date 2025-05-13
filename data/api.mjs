import express from "express";
import mysql from "mysql2/promise";

const router = express.Router();

const pool = mysql.createPool({
	host: "localhost",
	user: "root",
	password: "1234", // ← 본인 MySQL 비밀번호
	database: "database", // ← 본인 MySQL 데이터베이스 이름
	waitForConnections: true,
	connectionLimit: 10,
});

router.post("/saved_route", async (req, res) => {
	const { title, addr1, tel, firstimage, firstimage2, date } = req.body;

	try {
		const sql = `
			INSERT INTO saved_route (title, addr1, tel, firstimage, firstimage2, date)
			VALUES (?, ?, ?, ?, ?, ?)
		`;
		await pool.execute(sql, [title, addr1, tel, firstimage, firstimage2, date]);
		res.json({ message: "저장 완료!" });
	} catch (err) {
		console.error("❌ DB 저장 실패:", err);
		res.status(500).json({ message: "서버 오류 발생" });
	}
});

export default router;
