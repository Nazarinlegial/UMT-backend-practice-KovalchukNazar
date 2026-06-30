// Error type that carries an HTTP status code. Anything thrown inside a
// controller/service bubbles to the central error handler, which reads
// `.status` to build the `{ status, message }` response.
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = "HttpError";
  }

  static badRequest(message) {
    return new HttpError(400, message);
  }

  static unauthorized(message) {
    return new HttpError(401, message);
  }

  static forbidden(message) {
    return new HttpError(403, message);
  }

  static notFound(message) {
    return new HttpError(404, message);
  }

  static conflict(message) {
    return new HttpError(409, message);
  }

  static unprocessable(message) {
    return new HttpError(422, message);
  }
}
