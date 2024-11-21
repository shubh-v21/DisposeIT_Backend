import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiError } from "./utils/ApiError.js";
const app = express();

app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
		credentials: true,
	})
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//ROUTES
import userRouter from "./routes/user.routes.js";
import facilityRouter from "./routes/facility.routes.js";

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/facility", facilityRouter);
// http://localhost:8000/api/v1/users/register
app.use((err, req, res, next) => {
	if (err instanceof ApiError) {
		return res.status(err.statusCode).json(err.toJSON());
	}

	// For unhandled errors
	return res.status(500).json({
		success: false,
		statusCode: 500,
		message: err.message || "Internal Server Error",
		errors: [],
		data: null,
	});
});

export { app };
