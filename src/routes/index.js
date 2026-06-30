// Mounts every feature module under the /api namespace.
import { Router } from "express";

import authRoutes from "../features/auth/auth.routes.js";
import bouquetRoutes from "../features/bouquets/bouquet.routes.js";
import feedbackRoutes from "../features/feedbacks/feedback.routes.js";
import orderRoutes from "../features/orders/order.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/bouquets", bouquetRoutes);
router.use("/feedbacks", feedbackRoutes);
router.use("/orders", orderRoutes);

export default router;
