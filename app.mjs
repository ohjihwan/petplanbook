import express from "express";
import cors from "cors";
import session from "express-session";
import userRouter from "./router/user.mjs";
import routeRouter from "./router/route.mjs";
import postRouter from "./router/posts.mjs";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: "your-secure-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
  })
);
app.use("/uploads", express.static("uploads"));
app.use("/assets", express.static("assets"));
app.use("/", express.static("public"));
app.use("/api/user", userRouter);
app.use("/uploads", express.static("uploads")); // 정적 폴더 설정
app.use(postRouter);

app.use(routeRouter);

app.listen(8080, () => {
  console.log("서버 실행 중: http://localhost:8080");
});
