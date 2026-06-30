import { Router } from "express";

import { requireAuth } from "../../middleware/requireAuth.js";
import { validateBody, validateParams } from "../../middleware/validate.js";
import { idParamSchema } from "../../helpers/commonSchemas.js";
import * as feedbackController from "./feedback.controller.js";
import { createFeedbackSchema, updateFeedbackSchema } from "./feedback.schemas.js";

const router = Router();

// Public reads.
router.get("/", feedbackController.list);
router.get("/:id", validateParams(idParamSchema), feedbackController.getById);

// Protected writes (admin JWT required).
router.post("/", requireAuth, validateBody(createFeedbackSchema), feedbackController.create);
router.put("/:id", requireAuth, validateParams(idParamSchema), validateBody(updateFeedbackSchema), feedbackController.update);
router.delete("/:id", requireAuth, validateParams(idParamSchema), feedbackController.remove);

export default router;
