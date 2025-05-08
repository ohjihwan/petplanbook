import express from "express";
import petTravelRouter from "./api/petTravel.mjs";
import cors from "cors";
import session from "express-session";
import placeRouter from "./router/places.mjs";
import userRouter from "./router/user.mjs";

const app = express();

app.use(cors({
	origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use('/api', petTravelRouter)
app.use(session({
	secret: "your-secure-secret-key",
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 1000 * 60 * 60,
	}
}));
app.use("/uploads", express.static("uploads"));
app.use("/assets", express.static("assets"));
app.use("/", express.static("public"));
app.use("/api/user", userRouter);
app.use(placeRouter);

app.listen(8080, () => {
	console.log("서버 실행 중: http://localhost:8080");
});
