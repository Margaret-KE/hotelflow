import { Router } from "express";

import categoryRoutes from "./categories";
import menuItemRoutes from "./menu-items";
import paymentRoutes from "./payments";

const router = Router();

router.use("/categories", categoryRoutes);

router.use("/menu-items", menuItemRoutes);

router.use("/payments", paymentRoutes);

export default router;