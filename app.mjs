import express from "express";
import cors from "cors";
import placeRouter from "./router/places.mjs";
import userRouter from "./router/user.mjs"; // 지환 추가 : 하경 확인 완료 시 검토 후 주석 제거

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// html 정적 파일 제공 (브라우저에서 접근 가능하게) 지환 추가 : 하경 확인 완료 시 검토 후 주석 제거
app.use("/assets", express.static("assets"));
app.use("/", express.static("public"));
//

app.use("/api/user", userRouter); // 지환 추가 : 하경 확인 완료 시 검토 후 주석 제거
app.use(placeRouter);

app.listen(8080, () => {
  console.log("서버 실행 중: http://localhost:8080");
});
