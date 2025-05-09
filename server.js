import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import petTravelRouter from "./api/pet_travel.mjs";

const app = express();
const PORT = process.env.PORT || 8081;
const HOST = process.env.HOST;

// CORS 설정
app.use(cors());

// JSON 파싱 미들웨어
app.use(express.json());

// 정적 파일 제공
app.use(express.static("."));

// API 라우트 설정
app.use("/api/pet_travel", petTravelRouter);

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 http://${HOST}:${PORT} 에서 실행 중입니다.`);
});
