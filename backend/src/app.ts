import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./modules/auth/auth.routes";
import notFound from "./middleware/notFound";
import errorHandler from "./middleware/errorHandler";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(compression());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));

app.use("/api/auth", authRoutes);


app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to HotelFlow API",
    version: "1.0.0"
  });
});

app.use(notFound);

app.use(errorHandler);

export default app;