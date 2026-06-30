import { Router } from "express";

import { requireAuth } from "../../middlewares/requireAuth.js";
import { upload } from "../../middlewares/upload.js";
import { validateBody, validateParams, validateQuery } from "../../middlewares/validate.js";
import { idParamSchema } from "../../utils/commonSchemas.js";
import * as bouquetController from "./bouquet.controller.js";
import { createBouquetSchema, favoriteBouquetSchema, listBouquetsQuerySchema, updateBouquetSchema } from "./bouquet.schemas.js";

const router = Router();

// Public reads.
router.get("/", validateQuery(listBouquetsQuerySchema), bouquetController.list);
// Declared before "/:id" so "favorites" isn't parsed as an id.
router.get("/favorites", bouquetController.favorites);
router.get("/:id", validateParams(idParamSchema), bouquetController.getById);

// Protected writes (admin JWT required). Order: auth → validate id → upload → validate body.
router.post("/", requireAuth, upload.single("photo"), validateBody(createBouquetSchema), bouquetController.create);

router.put(
  "/:id",
  requireAuth,
  validateParams(idParamSchema),
  validateBody(updateBouquetSchema),
  bouquetController.update
);

router.patch(
  "/:id/favorite",
  requireAuth,
  validateParams(idParamSchema),
  validateBody(favoriteBouquetSchema),
  bouquetController.toggleFavorite
);

router.patch(
  "/:id/photo",
  requireAuth,
  validateParams(idParamSchema),
  upload.single("photo"),
  bouquetController.updatePhoto
);

router.delete("/:id", requireAuth, validateParams(idParamSchema), bouquetController.remove);

export default router;
