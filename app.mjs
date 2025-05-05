import express from "express";
import cors from "cors";
import placeRouter from "./router/places.mjs";

const app = express();

// ✅ 모든 출처 허용
app.use(cors());

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(placeRouter);

app.listen(8080, () => {
  console.log("서버 실행 중: http://localhost:8080");
});
