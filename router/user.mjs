import express from 'express';
import db from '../data/db.mjs';

const router = express.Router();

// 회원가입 API
router.post('/signup', async (req, res) => {
	try {
		const { email, password, nickname, region, pets, fileName } = req.body;

		// 고양이/강아지 중 하나만 저장 (ENUM 제한)
		const cat_or_dog = pets.includes('고양이') ? 'cat' :
			pets.includes('강아지') ? 'dog' : null;

		const profile_image_url = fileName
			? `/uploads/${fileName}`
			: null;

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

		res.status(200).json({ success: true, message: '회원가입 완료' });
	} catch (err) {
		console.error('회원가입 실패:', err);
		res.status(500).json({ success: false, message: '회원가입 실패' });
	}
});

export default router;
