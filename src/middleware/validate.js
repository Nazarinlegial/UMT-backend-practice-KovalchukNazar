import { HTTP_STATUS } from "../constants/httpStatus.js";
import { HttpError } from "../helpers/HttpError.js";
import { formatJoiError } from "../helpers/formatJoiError.js";

// Generic validation middleware factory. Validated/coerced values are stored on
// `req.validated[source]` rather than reassigned onto `req.query`/`req.params`,
// because those are read-only getters in Express 5. Invalid input → 400.
function validate(schema, source) {
  return (req, _res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      return next(new HttpError(HTTP_STATUS.BAD_REQUEST, formatJoiError(error)));
    }

    req.validated = req.validated ?? {};
    req.validated[source] = value;
    return next();
  };
}

export const validateBody = (schema) => validate(schema, "body");
export const validateQuery = (schema) => validate(schema, "query");
export const validateParams = (schema) => validate(schema, "params");
