import express from "express";
import cors from "cors";
import saveRouter from "./router/save.mjs";

const app = express();
const port = 8081;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// API 라우터 등록
app.use("/api", saveRouter);

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
}); 