// app.mjs
import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import petTravelRouter from "./api/petTravel.mjs";
import placeRouter from "./router/places.mjs";
import userRouter from "./router/user.mjs";

// 환경 변수 로드
dotenv.config();

const app = express();

// CORS 설정
app.use(cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// JSON 파싱 및 세션 설정
app.use(express.json());
app.use(session({
    secret: "your-secure-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60, // 1시간
    }
}));

// API 라우터 설정
app.use("/api/pet-travel", petTravelRouter); 
app.use("/api/user", userRouter);
app.use(placeRouter);

// 정적 파일 경로 (PL 폴더 직접 지정)
app.use("/PL", express.static("public/PL"));

// 404 에러 처리
app.use((req, res) => {
    res.status(404).send("404 Not Found");
});

// 서버 실행
app.listen(8081, () => {
    console.log("서버 실행 중: http://localhost:8081");
});
