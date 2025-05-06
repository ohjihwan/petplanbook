import express from "express";
import db from "../data/db.mjs";

const router = express.Router();

// 로그인 API
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "이메일과 비밀번호를 입력해 주세요." });
    }
    try {
        const [rows] = await db.query(
            "SELECT * FROM user WHERE email = ? AND password = ?",
            [email, password]
        );
        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: "이메일 또는 비밀번호가 틀렸습니다." });
        }
        const user = rows[0];
        res.json({
            success: true,
            email: user.email,
            nickname: user.nickname,
            region: user.region,
            cat_or_dog: user.cat_or_dog,
            profile_image_url: user.profile_image_url
        });
    } catch (err) {
        console.error("로그인 실패:", err);
        res.status(500).json({ success: false, message: "서버 오류가 발생했습니다." });
    }
});

// 회원가입 API
router.post("/signup", async (req, res) => {
	try {
		const { email, password, nickname, region, pets, fileName } = req.body;
		// 고양이/강아지 중 하나만 저장 (ENUM 제한)
		const cat_or_dog = pets.map(p => p === "고양이" ? "cat" : p === "강아지" ? "dog" : '')
							   .filter(Boolean)
							   .join(',');
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
		res.status(200).json({ success: true, message: "회원가입 완료" });
	} catch (err) {
		console.error("회원가입 실패:", err);
		res.status(500).json({ success: false, message: "회원가입 실패" });
	}
});

// 회원가입 아이디/이메일 중복 체크
router.post("/check-email", async (req, res) => {
	try {
		const { email } = req.body;
		const [rows] = await db.query("SELECT COUNT(*) AS count FROM user WHERE email = ?", [email]);
		if (rows[0].count > 0) {
			return res.status(409).json({ success: false, message: "이미 사용 중인 이메일입니다." });
		}
		res.json({ success: true, message: "사용 가능한 이메일입니다." });
	} catch (err) {
		console.error("이메일 중복 확인 오류:", err);
		res.status(500).json({ success: false, message: "서버 오류" });
	}
});

// 로그아웃
router.post("/logout", (req, res) => {
	req.session.destroy(err => {
		if (err) return res.status(500).send("로그아웃 실패");
		res.json({ success: true, message: "로그아웃 성공" });
	});
});
  
export default router;
