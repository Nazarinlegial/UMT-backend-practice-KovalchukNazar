import { HTTP_STATUS } from "../../constants/httpStatus.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as authService from "./auth.service.js";

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.validated.body);
  // access_token/token_type let Swagger UI's OAuth2 password flow authorize with
  // username+password directly (no manual token pasting). `token` is kept too.
  res.status(HTTP_STATUS.OK).json({ ...result, access_token: result.token, token_type: "Bearer" });
});
