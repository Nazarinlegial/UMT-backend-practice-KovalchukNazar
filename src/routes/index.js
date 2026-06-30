// Mounts every feature module under the /api namespace.
import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import bouquetRoutes from "../modules/bouquets/bouquet.routes.js";
import feedbackRoutes from "../modules/feedbacks/feedback.routes.js";
import orderRoutes from "../modules/orders/order.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/bouquets", bouquetRoutes);
router.use("/feedbacks", feedbackRoutes);
router.use("/orders", orderRoutes);

export default router;
