// app.mjs
import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import petTravelRouter from "./api/pet_travel.mjs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

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

// 정적 파일 경로
app.use("/uploads", express.static("uploads"));
app.use("/assets", express.static("assets"));
app.use("/", express.static("public"));

// 여행지 API 라우터 설정
app.use("/api/pet-travel", petTravelRouter);

// 404 에러 처리
app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
