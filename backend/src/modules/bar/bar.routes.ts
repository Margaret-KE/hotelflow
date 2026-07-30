import { Router } from "express";

import categoryRoutes from "./categories";
import menuItemRoutes from "./menu-items";
import orderRoutes from "./orders";
import orderItemRoutes from "./order-items";
import paymentRoutes from "./payments";

const router = Router();

router.use("/categories", categoryRoutes);

router.use("/menu-items", menuItemRoutes);

router.use("/orders", orderRoutes);

router.use("/order-items", orderItemRoutes);

router.use("/payments", paymentRoutes);

export default router;