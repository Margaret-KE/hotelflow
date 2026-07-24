import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./modules/auth/auth.routes";
import notFound from "./middleware/notFound";
import errorHandler from "./middleware/errorHandler";
import roomTypeRoutes from "./modules/room-types/roomType.routes";
import roomRoutes from "./modules/rooms/room.routes";
import guestRoutes from "./modules/guest/guest.routes";
import reservationRoutes from "./modules/reservations/reservation.routes";
import checkInRoutes from "./modules/checkin";
import checkOutRoutes from "./modules/checkout";
import paymentRoutes from "./modules/payments";
import restaurantRoutes from "./modules/restaurant/restaurant.routes";
import restaurantOrderRoutes from "./modules/restaurant/orders";
import restaurantOrderItemRoutes from "./modules/restaurant/order-items";
import kitchenRoutes from "./modules/restaurant/kitchen";

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

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/room-types", roomTypeRoutes);

app.use("/api/v1/rooms", roomRoutes);

app.use("/api/v1/guests", guestRoutes);

app.use("/api/v1/reservations", reservationRoutes);

app.use("/api/v1/checkin", checkInRoutes);

app.use("/api/v1/checkout", checkOutRoutes);

app.use("/api/v1/payments", paymentRoutes);

app.use("/api/v1/restaurant", restaurantRoutes);

app.use("/api/v1/restaurant/orders", restaurantOrderRoutes);

app.use("/api/v1/restaurant/order-items", restaurantOrderItemRoutes);

app.use("/api/v1/restaurant/kitchen", kitchenRoutes);

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