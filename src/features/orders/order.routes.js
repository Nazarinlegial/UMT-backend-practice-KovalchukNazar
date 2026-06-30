import { Router } from "express";

import { requireAuth } from "../../middleware/requireAuth.js";
import { validateBody, validateParams, validateQuery } from "../../middleware/validate.js";
import { idParamSchema } from "../../helpers/commonSchemas.js";
import * as orderController from "./order.controller.js";
import { createOrderSchema, listOrdersQuerySchema, updateOrderSchema } from "./order.schemas.js";

const router = Router();

// Placing an order is public (the storefront order form).
router.post("/", validateBody(createOrderSchema), orderController.create);

// Back-office: admin JWT required.
router.get("/", requireAuth, validateQuery(listOrdersQuerySchema), orderController.list);
router.get("/:id", requireAuth, validateParams(idParamSchema), orderController.getById);
router.put("/:id", requireAuth, validateParams(idParamSchema), validateBody(updateOrderSchema), orderController.update);
router.delete("/:id", requireAuth, validateParams(idParamSchema), orderController.remove);

export default router;
