// app.mjs
import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import petTravelRouter from "./api/pet_travel.mjs";
import saveRouter from "./router/save.mjs";
import apiRouter from "./data/api.mjs";
import userRouter from "./router/user.mjs";
import db from "./data/db.mjs";
import postsRouter from "./router/posts.mjs";
import deleteRouter from "./router/delete.mjs";
import saveRouteRouter from "./router/saveroute.mjs";
import postRouter from "./router/post.mjs"; 


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8081;
const HOST = process.env.HOST || "localhost";

// CORS 설정
app.use(
	cors({
		origin: true,
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // JSON 파싱 및 세션 설정
app.use("/api/user", userRouter);
app.use(
	session({
		secret: "your-secure-secret-key",
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 1000 * 60 * 60, // 1시간
		},
	})
);

// 정적 파일 경로
app.use("/uploads", express.static("uploads"));
app.use("/assets", express.static("assets"));
app.use("/", express.static("public"));

// 여행지 API 라우터 설정
app.use("/api/pet-travel", petTravelRouter);

// 경로찾기 시 DB 저장 라우터
app.use("/api", saveRouter);
app.use("/api", apiRouter);

// DB 삭제 라우터
app.use("/api", deleteRouter);

app.use("/api", saveRouteRouter); 

app.use("/api", postRouter); 


// 404 에러 처리
app.use((req, res) => {
	res.status(404).send("404 Not Found");
});

(async () => {
	try {
		const [rows] = await db.query("SELECT 1");
		console.log("✅ MySQL 연결 성공:", rows);
	} catch (error) {
		console.error("❌ MySQL 연결 실패:", error);
	}
})();

// 서버 실행
app.listen(PORT, () => {
	console.log(`서버 실행 중, 메인으로 가기: http://${HOST}:${PORT}/HM/HM010.html`);
});
