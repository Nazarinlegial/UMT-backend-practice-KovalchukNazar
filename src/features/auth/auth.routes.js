import { Router } from "express";

import { validateBody } from "../../middleware/validate.js";
import * as authController from "./auth.controller.js";
import { loginSchema } from "./auth.schemas.js";

const router = Router();

router.post("/login", validateBody(loginSchema), authController.login);

export default router;
