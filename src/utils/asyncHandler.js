// Wraps an async route handler so rejected promises are forwarded to Express's
// error middleware instead of crashing the process with an unhandled rejection.
export function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}
