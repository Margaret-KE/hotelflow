import { Router } from "express";

import categoryRoutes from "./categories";
import menuItemRoutes from "./menu-items";

const router = Router();

router.use("/categories", categoryRoutes);

router.use("/menu-items", menuItemRoutes);

export default router;