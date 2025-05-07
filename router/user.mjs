import express from "express";
import db from "../data/db.mjs";
import multer from "multer";
import path from "path";
import fs from "fs";

// ✅ Router 초기화
const router = express.Router();

// ✅ 이미지 저장 설정 (Multer 설정)
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const uploadPath = path.join(process.cwd(), "uploads/temp");
		if (!fs.existsSync(uploadPath)) {
			fs.mkdirSync(uploadPath, { recursive: true });
		}
		cb(null, uploadPath);
	},
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname);
		const user = req.body.nickname || "unknown";
		const fileName = `${user}_${Date.now()}${ext}`;
		cb(null, fileName);
	},
});

const upload = multer({ storage });

// ✅ 로그인 API
router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({ success: false, message: "이메일과 비밀번호를 입력해 주세요." });
		}

		const [rows] = await db.query("SELECT * FROM user WHERE email = ? AND password = ?", [email, password]);
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

// ✅ 회원가입 API
router.post("/signup", async (req, res) => {
	try {
		const { email, password, nickname, region, pets, fileName } = req.body;
		const cat_or_dog = pets ? pets.join(',') : null;
		const profile_image_url = fileName ? `/uploads/temp/${fileName}` : null;

		await db.execute(
			`INSERT INTO user (email, password, nickname, region, cat_or_dog, profile_image_url)
			 VALUES (?, ?, ?, ?, ?, ?)`,
			[email, password, nickname, region, cat_or_dog, profile_image_url]
		);

		res.status(200).json({ success: true, message: "회원가입 완료" });
	} catch (err) {
		console.error("회원가입 실패:", err);
		res.status(500).json({ success: false, message: "회원가입 실패" });
	}
});

// ✅ 이메일 중복 체크 API
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

// ✅ 사용자 정보 수정 API
router.put("/edit", async (req, res) => {
	try {
		const { email, password, nickname, region, pets } = req.body;
		const cat_or_dog = pets ? pets.join(',') : null;

		await db.execute(
			`UPDATE user SET password = ?, nickname = ?, region = ?, cat_or_dog = ? WHERE email = ?`,
			[password, nickname, region, cat_or_dog, email]
		);

		res.status(200).json({ success: true, message: "수정 완료" });
	} catch (err) {
		console.error("프로필 수정 실패:", err);
		res.status(500).json({ success: false, message: "서버 오류" });
	}
});

// ✅ 프로필 이미지 업로드 및 수정 API
router.post('/update-profile', upload.single("profileImage"), async (req, res) => {
    try {
        const { email, nickname, password, region } = req.body;
        const profileImage = req.file ? `/uploads/temp/${req.file.filename}` : null;

        if (!email || !nickname || !password || !region) {
            return res.status(400).json({ success: false, message: "필수 항목 누락" });
        }

        const sql = profileImage 
            ? `UPDATE user SET password = ?, nickname = ?, region = ?, profile_image_url = ? WHERE email = ?`
            : `UPDATE user SET password = ?, nickname = ?, region = ? WHERE email = ?`;

        const params = profileImage 
            ? [password, nickname, region, profileImage, email]
            : [password, nickname, region, email];

        const [result] = await db.execute(sql, params);

        if (result.affectedRows === 1) {
            return res.json({ success: true, imageUrl: profileImage || null });
        } else {
            return res.status(400).json({ success: false, message: "업데이트 실패" });
        }
    } catch (error) {
        console.error("❌ 프로필 수정 오류:", error);
        return res.status(500).json({ success: false, message: "서버 오류 발생" });
    }
});

// ✅ 프로필 이미지 삭제 API
router.post('/delete-profile-image', async (req, res) => {
	try {
		const { email } = req.body;
		if (!email) return res.status(400).json({ success: false, message: "이메일 누락" });

		const [rows] = await db.query(`SELECT profile_image_url FROM user WHERE email = ?`, [email]);
		const imagePath = rows[0]?.profile_image_url?.replace('/uploads', './uploads');

		// 이미지 파일 삭제
		if (imagePath && fs.existsSync(imagePath)) {
			fs.unlinkSync(imagePath);
		}

		await db.execute(`UPDATE user SET profile_image_url = NULL WHERE email = ?`, [email]);
		res.json({ success: true });
	} catch (error) {
		console.error("프로필 이미지 삭제 오류:", error);
		res.status(500).json({ success: false, message: "서버 오류" });
	}
});

// ✅ 로그아웃 API
router.post("/logout", (req, res) => {
	req.session.destroy(err => {
		if (err) return res.status(500).send("로그아웃 실패");
		res.json({ success: true, message: "로그아웃 성공" });
	});
});

export default router;
